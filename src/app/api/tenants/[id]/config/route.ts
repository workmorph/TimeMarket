import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// テナント設定スキーマ
const tenantConfigSchema = z.object({
  widget_settings: z
    .object({
      theme: z.enum(["light", "dark", "auto"]).optional(),
      primary_color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "有効なカラーコードを入力してください")
        .optional(),
      secondary_color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "有効なカラーコードを入力してください")
        .optional(),
      border_radius: z.number().min(0).max(20).optional(),
      show_logo: z.boolean().optional(),
      custom_css: z.string().max(5000, "カスタムCSSは5000文字以内で入力してください").optional(),
      show_timebid_branding: z.boolean().optional(),
    })
    .optional(),

  auction_settings: z
    .object({
      default_auction_duration: z.number().min(1).max(30).optional(), // 日数
      min_bid_amount: z.number().min(0).optional(),
      allow_anonymous_auctions: z.boolean().optional(),
      require_approval: z.boolean().optional(),
    })
    .optional(),

  notification_settings: z
    .object({
      email_notifications: z.boolean().optional(),
      slack_webhook_url: z.string().url("有効なURLを入力してください").optional().nullable(),
      notify_on_new_auction: z.boolean().optional(),
      notify_on_new_bid: z.boolean().optional(),
      notify_on_auction_end: z.boolean().optional(),
    })
    .optional(),

  api_settings: z
    .object({
      rate_limit: z.number().min(10).max(1000).optional(), // 1分あたりのリクエスト数
      allowed_origins: z.array(z.string()).optional(),
      require_api_key: z.boolean().optional(),
    })
    .optional(),
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
 * テナント設定を取得
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

    // テナント設定の取得
    const { data: config, error } = await supabase
      .from("tenant_configs")
      .select("*")
      .eq("tenant_id", tenantId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116: 結果が見つからない
      console.error("テナント設定取得エラー:", error);
      return NextResponse.json({ error: "テナント設定の取得に失敗しました" }, { status: 500 });
    }

    // 設定がない場合はデフォルト設定を返す
    if (!config) {
      const defaultConfig = {
        tenant_id: tenantId,
        widget_settings: {
          theme: "light",
          primary_color: "#3b82f6",
          secondary_color: "#10b981",
          border_radius: 8,
          show_logo: true,
          show_timebid_branding: true,
          custom_css: "",
        },
        auction_settings: {
          default_auction_duration: 7,
          min_bid_amount: 1000,
          allow_anonymous_auctions: false,
          require_approval: true,
        },
        notification_settings: {
          email_notifications: true,
          slack_webhook_url: null,
          notify_on_new_auction: true,
          notify_on_new_bid: true,
          notify_on_auction_end: true,
        },
        api_settings: {
          rate_limit: 60,
          allowed_origins: [],
          require_api_key: true,
        },
      };

      return NextResponse.json({ config: defaultConfig });
    }

    return NextResponse.json({ config });
  } catch (error) {
    console.error("テナント設定取得エラー:", error);
    return NextResponse.json({ error: "テナント設定の取得に失敗しました" }, { status: 500 });
  }
}

/**
 * テナント設定を更新
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const validationResult = tenantConfigSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const configData = validationResult.data;

    // 既存の設定を取得
    const { data: existingConfig } = await supabase
      .from("tenant_configs")
      .select("id")
      .eq("tenant_id", tenantId)
      .single();

    let result;

    if (existingConfig) {
      // 既存の設定を更新
      result = await supabase
        .from("tenant_configs")
        .update({
          ...configData,
          updated_at: new Date().toISOString(),
        })
        .eq("tenant_id", tenantId)
        .select()
        .single();
    } else {
      // 新しい設定を作成
      result = await supabase
        .from("tenant_configs")
        .insert({
          tenant_id: tenantId,
          ...configData,
        })
        .select()
        .single();
    }

    const { data: updatedConfig, error } = result;

    if (error) {
      console.error("テナント設定更新エラー:", error);
      return NextResponse.json({ error: "テナント設定の更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ config: updatedConfig });
  } catch (error) {
    console.error("テナント設定更新エラー:", error);
    return NextResponse.json({ error: "テナント設定の更新に失敗しました" }, { status: 500 });
  }
}

/**
 * テナント設定の一部を更新
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
    const validationResult = tenantConfigSchema.partial().safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const configData = validationResult.data;

    // 既存の設定を取得
    const { data: existingConfig } = await supabase
      .from("tenant_configs")
      .select("*")
      .eq("tenant_id", tenantId)
      .single();

    let result;

    if (existingConfig) {
      // 既存の設定を更新（マージ）
      const mergedConfig = {
        widget_settings: {
          ...(existingConfig.widget_settings || {}),
          ...(configData.widget_settings || {}),
        },
        auction_settings: {
          ...(existingConfig.auction_settings || {}),
          ...(configData.auction_settings || {}),
        },
        notification_settings: {
          ...(existingConfig.notification_settings || {}),
          ...(configData.notification_settings || {}),
        },
        api_settings: {
          ...(existingConfig.api_settings || {}),
          ...(configData.api_settings || {}),
        },
      };

      result = await supabase
        .from("tenant_configs")
        .update({
          ...mergedConfig,
          updated_at: new Date().toISOString(),
        })
        .eq("tenant_id", tenantId)
        .select()
        .single();
    } else {
      // 新しい設定を作成
      result = await supabase
        .from("tenant_configs")
        .insert({
          tenant_id: tenantId,
          ...configData,
        })
        .select()
        .single();
    }

    const { data: updatedConfig, error } = result;

    if (error) {
      console.error("テナント設定更新エラー:", error);
      return NextResponse.json({ error: "テナント設定の更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ config: updatedConfig });
  } catch (error) {
    console.error("テナント設定更新エラー:", error);
    return NextResponse.json({ error: "テナント設定の更新に失敗しました" }, { status: 500 });
  }
}
