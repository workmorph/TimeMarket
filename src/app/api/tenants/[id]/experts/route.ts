import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// 専門家追加スキーマ
const addExpertSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  role: z.enum(["admin", "expert"]),
  specialties: z.array(z.string()).optional(),
  hourly_rate: z.number().min(0, "時間単価は0以上である必要があります").optional(),
});

// 専門家更新スキーマ（現在未使用だが将来の機能拡張で使用予定）
// const updateExpertSchema = z.object({
//   role: z.enum(['admin', 'expert']).optional(),
//   specialties: z.array(z.string()).optional(),
//   hourly_rate: z.number().min(0, '時間単価は0以上である必要があります').optional(),
//   is_active: z.boolean().optional(),
// })

// 専門家一括追加スキーマ
const bulkAddExpertsSchema = z.object({
  experts: z.array(addExpertSchema),
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
 * テナントに所属する専門家一覧を取得
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const { searchParams } = new URL(request.url);

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // テナントの存在確認
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
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

    // クエリパラメータ
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    // クエリ構築
    let query = supabase
      .from("tenant_experts")
      .select(
        `
        *,
        users:user_id (
          id,
          email,
          display_name,
          avatar_url
        )
      `
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    // ロールでフィルタリング
    if (role) {
      query = query.eq("role", role);
    }

    // 検索クエリがある場合、ユーザー情報で検索
    if (search) {
      query = query.textSearch("users.email", search, {
        config: "english",
      });
    }

    // ページネーション
    query = query.range(offset, offset + limit - 1);

    // 実行
    const { data: experts, error } = await query;

    if (error) {
      console.error("専門家一覧取得エラー:", error);
      return NextResponse.json({ error: "専門家一覧の取得に失敗しました" }, { status: 500 });
    }

    // 総数を取得
    const { count: totalCount } = await supabase
      .from("tenant_experts")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    return NextResponse.json({
      experts,
      page,
      limit,
      total: totalCount,
    });
  } catch (error) {
    console.error("専門家一覧取得エラー:", error);
    return NextResponse.json({ error: "専門家一覧の取得に失敗しました" }, { status: 500 });
  }
}

/**
 * テナントに専門家を追加
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: "テナントが見つかりません" }, { status: 404 });
    }

    // アクセス権限チェック
    const hasAccess = await checkTenantAccess(supabase, tenantId, user.id);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "このテナントへのアクセス権限がありません" },
        { status: 403 }
      );
    }

    // リクエストボディの検証
    const body = await request.json();

    // 一括追加かどうかをチェック
    if (Array.isArray(body.experts)) {
      const validationResult = bulkAddExpertsSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "入力データが無効です",
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const results = [];

      // 各専門家を追加
      for (const expertData of validationResult.data.experts) {
        const result = await addExpertToTenant(supabase, tenantId, expertData);
        results.push(result);
      }

      return NextResponse.json({ results });
    } else {
      // 単一の専門家を追加
      const validationResult = addExpertSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "入力データが無効です",
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const result = await addExpertToTenant(supabase, tenantId, validationResult.data);

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 500 });
      }

      return NextResponse.json({ expert: result.expert }, { status: 201 });
    }
  } catch (error) {
    console.error("専門家追加エラー:", error);
    return NextResponse.json({ error: "専門家の追加に失敗しました" }, { status: 500 });
  }
}

/**
 * テナントに専門家を追加するヘルパー関数
 */
async function addExpertToTenant(
  supabase: SupabaseClient,
  tenantId: string,
  expertData: { email: string; role: string; specialties?: string[]; hourly_rate?: number }
) {
  try {
    // メールアドレスからユーザーを検索
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", expertData.email)
      .single();

    if (userError) {
      // ユーザーが見つからない場合は招待メールを送信
      // 注: 実際の招待メール送信ロジックは別途実装が必要
      return {
        status: 404,
        error: "ユーザーが見つかりません。招待メールを送信しました。",
        email: expertData.email,
      };
    }

    // すでにテナントに所属しているかチェック
    const { data: existingExpert } = await supabase
      .from("tenant_experts")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("user_id", userData.id)
      .single();

    if (existingExpert) {
      return {
        status: 409,
        error: "このユーザーはすでにテナントに所属しています",
        email: expertData.email,
      };
    }

    // テナントに専門家を追加
    const { data: newExpert, error } = await supabase
      .from("tenant_experts")
      .insert({
        tenant_id: tenantId,
        user_id: userData.id,
        role: expertData.role,
        specialties: expertData.specialties || [],
        hourly_rate: expertData.hourly_rate,
      })
      .select(
        `
        *,
        users:user_id (
          id,
          email,
          display_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      console.error("専門家追加エラー:", error);
      return {
        status: 500,
        error: "専門家の追加に失敗しました",
        details: error,
      };
    }

    return { expert: newExpert };
  } catch (error) {
    console.error("専門家追加ヘルパーエラー:", error);
    return {
      status: 500,
      error: "専門家の追加に失敗しました",
      details: error,
    };
  }
}

/**
 * テナントから専門家を一括削除
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id, owner_id")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: "テナントが見つかりません" }, { status: 404 });
    }

    // アクセス権限チェック
    const hasAccess = await checkTenantAccess(supabase, tenantId, user.id);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "このテナントへのアクセス権限がありません" },
        { status: 403 }
      );
    }

    // リクエストボディの検証
    const body = await request.json();

    if (!Array.isArray(body.expert_ids)) {
      return NextResponse.json({ error: "expert_idsの配列が必要です" }, { status: 400 });
    }

    // テナントオーナー自身は削除できないようにする
    const { data: ownerExpert } = await supabase
      .from("tenant_experts")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("user_id", tenant.owner_id)
      .single();

    if (ownerExpert && body.expert_ids.includes(ownerExpert.id)) {
      return NextResponse.json(
        {
          error: "テナントオーナーをテナントから削除することはできません",
        },
        { status: 400 }
      );
    }

    // 専門家の削除
    const { data, error } = await supabase
      .from("tenant_experts")
      .delete()
      .in("id", body.expert_ids)
      .eq("tenant_id", tenantId) // 念のため、指定されたテナントの専門家のみを削除
      .select();

    if (error) {
      console.error("専門家削除エラー:", error);
      return NextResponse.json({ error: "専門家の削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length}人の専門家を削除しました`,
      deleted_experts: data,
    });
  } catch (error) {
    console.error("専門家削除エラー:", error);
    return NextResponse.json({ error: "専門家の削除に失敗しました" }, { status: 500 });
  }
}
