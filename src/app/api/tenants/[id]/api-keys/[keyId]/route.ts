import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// APIキー更新スキーマ
const updateApiKeySchema = z.object({
  name: z
    .string()
    .min(1, "名前は必須です")
    .max(100, "名前は100文字以内で入力してください")
    .optional(),
  is_active: z.boolean().optional(),
  expires_at: z.string().datetime().optional().nullable(),
  allowed_origins: z.array(z.string().url("有効なURLを入力してください")).optional(),
  scopes: z.array(z.string()).optional(),
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
 * 特定のAPIキー情報を取得
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; keyId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const keyId = params.keyId;

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

    // APIキーの取得
    const { data: apiKey, error } = await supabase
      .from("tenant_api_keys")
      .select(
        "id, name, created_at, updated_at, expires_at, is_active, last_used_at, allowed_origins, scopes, created_by"
      )
      .eq("id", keyId)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 結果が見つからない
        return NextResponse.json({ error: "APIキーが見つかりません" }, { status: 404 });
      }
      console.error("APIキー取得エラー:", error);
      return NextResponse.json({ error: "APIキーの取得に失敗しました" }, { status: 500 });
    }

    // 作成者の情報を取得
    let creatorInfo = null;
    if (apiKey.created_by) {
      const { data: creator } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", apiKey.created_by)
        .single();

      if (creator) {
        creatorInfo = creator;
      }
    }

    return NextResponse.json({
      api_key: {
        ...apiKey,
        creator: creatorInfo,
      },
    });
  } catch (error) {
    console.error("APIキー取得エラー:", error);
    return NextResponse.json({ error: "APIキーの取得に失敗しました" }, { status: 500 });
  }
}

/**
 * 特定のAPIキーを更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; keyId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const keyId = params.keyId;

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

    // APIキーの存在確認
    const { data: existingApiKey, error: apiKeyError } = await supabase
      .from("tenant_api_keys")
      .select("id")
      .eq("id", keyId)
      .eq("tenant_id", tenantId)
      .single();

    if (apiKeyError || !existingApiKey) {
      return NextResponse.json({ error: "APIキーが見つかりません" }, { status: 404 });
    }

    // リクエストボディの検証
    const body = await request.json();
    const validationResult = updateApiKeySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const apiKeyData = validationResult.data;

    // APIキーの更新
    const { data: updatedApiKey, error } = await supabase
      .from("tenant_api_keys")
      .update({
        ...apiKeyData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", keyId)
      .eq("tenant_id", tenantId)
      .select("id, name, created_at, updated_at, expires_at, is_active, allowed_origins, scopes")
      .single();

    if (error) {
      console.error("APIキー更新エラー:", error);
      return NextResponse.json({ error: "APIキーの更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ api_key: updatedApiKey });
  } catch (error) {
    console.error("APIキー更新エラー:", error);
    return NextResponse.json({ error: "APIキーの更新に失敗しました" }, { status: 500 });
  }
}

/**
 * 特定のAPIキーを削除
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; keyId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const keyId = params.keyId;

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

    // APIキーの存在確認
    const { data: existingApiKey, error: apiKeyError } = await supabase
      .from("tenant_api_keys")
      .select("id, name")
      .eq("id", keyId)
      .eq("tenant_id", tenantId)
      .single();

    if (apiKeyError || !existingApiKey) {
      return NextResponse.json({ error: "APIキーが見つかりません" }, { status: 404 });
    }

    // APIキーの削除
    const { error } = await supabase
      .from("tenant_api_keys")
      .delete()
      .eq("id", keyId)
      .eq("tenant_id", tenantId);

    if (error) {
      console.error("APIキー削除エラー:", error);
      return NextResponse.json({ error: "APIキーの削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: "APIキーを削除しました",
      deleted_api_key: {
        id: existingApiKey.id,
        name: existingApiKey.name,
      },
    });
  } catch (error) {
    console.error("APIキー削除エラー:", error);
    return NextResponse.json({ error: "APIキーの削除に失敗しました" }, { status: 500 });
  }
}
