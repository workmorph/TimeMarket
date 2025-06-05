import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

// テナント作成スキーマ
const createTenantSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100, "名前は100文字以内で入力してください"),
  slug: z
    .string()
    .min(1, "スラッグは必須です")
    .max(50, "スラッグは50文字以内で入力してください")
    .regex(/^[a-z0-9-]+$/, "スラッグは小文字英数字とハイフンのみ使用できます"),
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
});

// テナント更新スキーマ
const updateTenantSchema = createTenantSchema.partial().extend({
  is_active: z.boolean().optional(),
});

/**
 * テナント一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // クエリパラメータ
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // ユーザーが所有者または管理者のテナントを取得
    const { data: ownedTenants, error: ownedError } = await supabase
      .from("tenants")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (ownedError) {
      console.error("テナント取得エラー:", ownedError);
      return NextResponse.json({ error: "テナントの取得に失敗しました" }, { status: 500 });
    }

    // ユーザーが管理者として所属しているテナントを取得
    const { data: adminTenants, error: adminError } = await supabase
      .from("tenant_experts")
      .select("tenant_id, tenants(*)")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (adminError) {
      console.error("管理者テナント取得エラー:", adminError);
      return NextResponse.json({ error: "管理者テナントの取得に失敗しました" }, { status: 500 });
    }

    // 結果を結合して重複を排除
    const adminTenantsData = adminTenants.map((item) => item.tenants);
    const allTenants = [...ownedTenants, ...adminTenantsData];

    // テナントIDで重複を排除
    const uniqueTenants = Array.from(
      new Map(allTenants.map((tenant) => [tenant.id, tenant])).values()
    );

    return NextResponse.json({
      tenants: uniqueTenants,
      page,
      limit,
      total: uniqueTenants.length,
    });
  } catch (error) {
    console.error("テナント一覧取得エラー:", error);
    return NextResponse.json({ error: "テナント一覧の取得に失敗しました" }, { status: 500 });
  }
}

/**
 * 新しいテナントを作成
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // リクエストボディの検証
    const body = await request.json();
    const validationResult = createTenantSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const tenantData = validationResult.data;

    // スラッグの重複チェック
    const { data: existingTenant } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", tenantData.slug)
      .single();

    if (existingTenant) {
      return NextResponse.json({ error: "このスラッグは既に使用されています" }, { status: 409 });
    }

    // テナントの作成
    const { data: newTenant, error } = await supabase
      .from("tenants")
      .insert({
        ...tenantData,
        owner_id: user.id,
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日間のトライアル
      })
      .select()
      .single();

    if (error) {
      console.error("テナント作成エラー:", error);
      return NextResponse.json({ error: "テナントの作成に失敗しました" }, { status: 500 });
    }

    // 作成者を管理者として登録
    const { error: expertError } = await supabase.from("tenant_experts").insert({
      tenant_id: newTenant.id,
      user_id: user.id,
      role: "admin",
    });

    if (expertError) {
      console.error("管理者登録エラー:", expertError);
      // テナントは作成されているので、エラーは返さずに警告のみ
      console.warn("テナント作成者の管理者登録に失敗しました");
    }

    return NextResponse.json({ tenant: newTenant }, { status: 201 });
  } catch (error) {
    console.error("テナント作成エラー:", error);
    return NextResponse.json({ error: "テナントの作成に失敗しました" }, { status: 500 });
  }
}

/**
 * テナント一括更新（管理者用）
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 管理者権限チェック
    const { data: isAdmin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }

    // リクエストボディの検証
    const body = await request.json();

    if (!Array.isArray(body.tenants)) {
      return NextResponse.json({ error: "tenantsの配列が必要です" }, { status: 400 });
    }

    const results = [];

    // 各テナントを更新
    for (const tenant of body.tenants) {
      if (!tenant.id) {
        results.push({ error: "テナントIDが必要です", tenant });
        continue;
      }

      const validationResult = updateTenantSchema.safeParse(tenant);

      if (!validationResult.success) {
        results.push({
          error: "入力データが無効です",
          details: validationResult.error.format(),
          tenant,
        });
        continue;
      }

      const { data: updatedTenant, error } = await supabase
        .from("tenants")
        .update(validationResult.data)
        .eq("id", tenant.id)
        .select()
        .single();

      if (error) {
        results.push({ error: "テナントの更新に失敗しました", details: error, tenant });
      } else {
        results.push({ success: true, tenant: updatedTenant });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("テナント一括更新エラー:", error);
    return NextResponse.json({ error: "テナントの一括更新に失敗しました" }, { status: 500 });
  }
}

/**
 * テナント一括削除（管理者用）
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 管理者権限チェック
    const { data: isAdmin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }

    // リクエストボディの検証
    const body = await request.json();

    if (!Array.isArray(body.tenant_ids)) {
      return NextResponse.json({ error: "tenant_idsの配列が必要です" }, { status: 400 });
    }

    // テナントの削除
    const { data, error } = await supabase
      .from("tenants")
      .delete()
      .in("id", body.tenant_ids)
      .select();

    if (error) {
      console.error("テナント削除エラー:", error);
      return NextResponse.json({ error: "テナントの削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length}件のテナントを削除しました`,
      deleted_tenants: data,
    });
  } catch (error) {
    console.error("テナント削除エラー:", error);
    return NextResponse.json({ error: "テナントの削除に失敗しました" }, { status: 500 });
  }
}
