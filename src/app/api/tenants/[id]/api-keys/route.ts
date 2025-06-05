import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

// APIキー作成スキーマ
const createApiKeySchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100, "名前は100文字以内で入力してください"),
  expires_at: z.string().datetime().optional(),
  allowed_origins: z.array(z.string().url("有効なURLを入力してください")).optional(),
  scopes: z.array(z.string()).optional(),
});

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
 * APIキーを生成する
 */
function generateApiKey() {
  return `tb_${crypto.randomBytes(24).toString("hex")}`;
}

/**
 * APIキーのハッシュを生成する
 */
function hashApiKey(apiKey: string) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

/**
 * テナントのAPIキー一覧を取得
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

    if (!hasAccess) {
      return NextResponse.json(
        { error: "このテナントへのアクセス権限がありません" },
        { status: 403 }
      );
    }

    // APIキーの取得
    const { data: apiKeys, error } = await supabase
      .from("tenant_api_keys")
      .select(
        "id, name, created_at, updated_at, expires_at, is_active, last_used_at, allowed_origins, scopes"
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("APIキー取得エラー:", error);
      return NextResponse.json({ error: "APIキーの取得に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ api_keys: apiKeys });
  } catch (error) {
    console.error("APIキー一覧取得エラー:", error);
    return NextResponse.json({ error: "APIキー一覧の取得に失敗しました" }, { status: 500 });
  }
}

/**
 * 新しいAPIキーを作成
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
    const validationResult = createApiKeySchema.safeParse(body);

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

    // APIキーの生成
    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);

    // APIキーの保存
    const { data: newApiKey, error } = await supabase
      .from("tenant_api_keys")
      .insert({
        tenant_id: tenantId,
        key_hash: apiKeyHash,
        name: apiKeyData.name,
        expires_at: apiKeyData.expires_at,
        allowed_origins: apiKeyData.allowed_origins || [],
        scopes: apiKeyData.scopes || ["read"],
        created_by: user.id,
      })
      .select("id, name, created_at, updated_at, expires_at, is_active, allowed_origins, scopes")
      .single();

    if (error) {
      console.error("APIキー作成エラー:", error);
      return NextResponse.json({ error: "APIキーの作成に失敗しました" }, { status: 500 });
    }

    // APIキーは一度だけ表示
    return NextResponse.json(
      {
        api_key: {
          ...newApiKey,
          key: apiKey, // この値はレスポンスでのみ返し、以降は取得できない
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("APIキー作成エラー:", error);
    return NextResponse.json({ error: "APIキーの作成に失敗しました" }, { status: 500 });
  }
}

/**
 * APIキーを一括更新
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

    if (!Array.isArray(body.api_keys)) {
      return NextResponse.json({ error: "api_keysの配列が必要です" }, { status: 400 });
    }

    const results = [];

    // 各APIキーを更新
    for (const apiKeyUpdate of body.api_keys) {
      if (!apiKeyUpdate.id) {
        results.push({ error: "APIキーIDが必要です", api_key: apiKeyUpdate });
        continue;
      }

      const validationResult = updateApiKeySchema.safeParse(apiKeyUpdate);

      if (!validationResult.success) {
        results.push({
          error: "入力データが無効です",
          details: validationResult.error.format(),
          api_key: apiKeyUpdate,
        });
        continue;
      }

      // APIキーの所有権確認
      const { data: existingApiKey } = await supabase
        .from("tenant_api_keys")
        .select("id")
        .eq("id", apiKeyUpdate.id)
        .eq("tenant_id", tenantId)
        .single();

      if (!existingApiKey) {
        results.push({
          error: "APIキーが見つからないか、このテナントに属していません",
          api_key: apiKeyUpdate,
        });
        continue;
      }

      // APIキーの更新
      const { data: updatedApiKey, error } = await supabase
        .from("tenant_api_keys")
        .update({
          ...validationResult.data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", apiKeyUpdate.id)
        .eq("tenant_id", tenantId)
        .select("id, name, created_at, updated_at, expires_at, is_active, allowed_origins, scopes")
        .single();

      if (error) {
        results.push({
          error: "APIキーの更新に失敗しました",
          details: error,
          api_key: apiKeyUpdate,
        });
      } else {
        results.push({ success: true, api_key: updatedApiKey });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("APIキー一括更新エラー:", error);
    return NextResponse.json({ error: "APIキーの一括更新に失敗しました" }, { status: 500 });
  }
}

/**
 * APIキーを一括削除
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

    if (!Array.isArray(body.api_key_ids)) {
      return NextResponse.json({ error: "api_key_idsの配列が必要です" }, { status: 400 });
    }

    // APIキーの削除
    const { data, error } = await supabase
      .from("tenant_api_keys")
      .delete()
      .in("id", body.api_key_ids)
      .eq("tenant_id", tenantId) // 念のため、指定されたテナントのAPIキーのみを削除
      .select("id, name");

    if (error) {
      console.error("APIキー削除エラー:", error);
      return NextResponse.json({ error: "APIキーの削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length}件のAPIキーを削除しました`,
      deleted_api_keys: data,
    });
  } catch (error) {
    console.error("APIキー削除エラー:", error);
    return NextResponse.json({ error: "APIキーの削除に失敗しました" }, { status: 500 });
  }
}
