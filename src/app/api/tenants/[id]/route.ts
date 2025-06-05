import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// テナント更新スキーマ
const updateTenantSchema = z.object({
  name: z
    .string()
    .min(1, "名前は必須です")
    .max(100, "名前は100文字以内で入力してください")
    .optional(),
  slug: z
    .string()
    .min(1, "スラッグは必須です")
    .max(50, "スラッグは50文字以内で入力してください")
    .regex(/^[a-z0-9-]+$/, "スラッグは小文字英数字とハイフンのみ使用できます")
    .optional(),
  description: z.string().max(500, "説明は500文字以内で入力してください").optional(),
  logo_url: z.string().url("有効なURLを入力してください").optional().nullable(),
  primary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "有効なカラーコードを入力してください")
    .optional(),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "有効なカラーコードを入力してください")
    .optional(),
  subscription_plan: z.enum(["basic", "professional", "enterprise"]).optional(),
  is_active: z.boolean().optional(),
});

/**
 * テナントへのアクセス権限をチェック
 */
async function checkTenantAccess(supabase: SupabaseClient, tenantId: string, userId: string) {
  // テナントの所有者かどうかをチェック
  const { data: tenant } = await supabase
    .from("tenants")
    .select("owner_id")
    .eq("id", tenantId)
    .single();

  if (tenant?.owner_id === userId) {
    return true;
  }

  // テナントの管理者かどうかをチェック
  const { data: expertRole } = await supabase
    .from("tenant_experts")
    .select("role")
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .single();

  return expertRole?.role === "admin";
}

/**
 * 特定のテナントを取得
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // テナントの取得
    const { data: tenant, error } = await supabase
      .from("tenants")
      .select("*, tenant_configs(*)")
      .eq("id", tenantId)
      .single();

    if (error) {
      console.error("テナント取得エラー:", error);
      return NextResponse.json({ error: "テナントの取得に失敗しました" }, { status: 500 });
    }

    if (!tenant) {
      return NextResponse.json({ error: "テナントが見つかりません" }, { status: 404 });
    }

    // アクセス権限チェック
    const hasAccess = await checkTenantAccess(supabase, tenantId, user.id);

    // 管理者権限チェック
    const { data: isAdmin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!hasAccess && !isAdmin) {
      return NextResponse.json(
        { error: "このテナントへのアクセス権限がありません" },
        { status: 403 }
      );
    }

    // テナントに所属する専門家の数を取得
    const { count: expertsCount } = await supabase
      .from("tenant_experts")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    // テナントのオークション数を取得
    const { count: auctionsCount } = await supabase
      .from("auctions")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    return NextResponse.json({
      tenant,
      stats: {
        experts_count: expertsCount,
        auctions_count: auctionsCount,
      },
    });
  } catch (error) {
    console.error("テナント取得エラー:", error);
    return NextResponse.json({ error: "テナントの取得に失敗しました" }, { status: 500 });
  }
}

/**
 * 特定のテナントを更新
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // テナントの存在確認
    const { data: tenant, error: fetchError } = await supabase
      .from("tenants")
      .select("id, owner_id")
      .eq("id", tenantId)
      .single();

    if (fetchError || !tenant) {
      return NextResponse.json({ error: "テナントが見つかりません" }, { status: 404 });
    }

    // アクセス権限チェック
    const hasAccess = await checkTenantAccess(supabase, tenantId, user.id);

    // 管理者権限チェック
    const { data: isAdmin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!hasAccess && !isAdmin) {
      return NextResponse.json(
        { error: "このテナントへのアクセス権限がありません" },
        { status: 403 }
      );
    }

    // リクエストボディの検証
    const body = await request.json();
    const validationResult = updateTenantSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // スラッグの重複チェック（スラッグが変更される場合のみ）
    if (updateData.slug) {
      const { data: existingTenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("slug", updateData.slug)
        .neq("id", tenantId)
        .single();

      if (existingTenant) {
        return NextResponse.json({ error: "このスラッグは既に使用されています" }, { status: 409 });
      }
    }

    // テナントの更新
    const { data: updatedTenant, error } = await supabase
      .from("tenants")
      .update(updateData)
      .eq("id", tenantId)
      .select()
      .single();

    if (error) {
      console.error("テナント更新エラー:", error);
      return NextResponse.json({ error: "テナントの更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ tenant: updatedTenant });
  } catch (error) {
    console.error("テナント更新エラー:", error);
    return NextResponse.json({ error: "テナントの更新に失敗しました" }, { status: 500 });
  }
}

/**
 * 特定のテナントを削除
 */
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // テナントの存在確認
    const { data: tenant, error: fetchError } = await supabase
      .from("tenants")
      .select("id, owner_id")
      .eq("id", tenantId)
      .single();

    if (fetchError || !tenant) {
      return NextResponse.json({ error: "テナントが見つかりません" }, { status: 404 });
    }

    // 所有者または管理者のみ削除可能
    if (tenant.owner_id !== user.id) {
      // 管理者権限チェック
      const { data: isAdmin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!isAdmin) {
        return NextResponse.json({ error: "テナントの削除権限がありません" }, { status: 403 });
      }
    }

    // テナントの削除
    const { data: deletedTenant, error } = await supabase
      .from("tenants")
      .delete()
      .eq("id", tenantId)
      .select()
      .single();

    if (error) {
      console.error("テナント削除エラー:", error);
      return NextResponse.json({ error: "テナントの削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: "テナントを削除しました",
      tenant: deletedTenant,
    });
  } catch (error) {
    console.error("テナント削除エラー:", error);
    return NextResponse.json({ error: "テナントの削除に失敗しました" }, { status: 500 });
  }
}
