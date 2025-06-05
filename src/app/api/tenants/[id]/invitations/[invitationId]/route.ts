import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// 招待更新スキーマ
const updateInvitationSchema = z.object({
  role: z
    .enum(["member", "admin"], {
      invalid_type_error: "ロールは member または admin である必要があります",
    })
    .optional(),
  status: z
    .enum(["pending", "accepted", "rejected", "expired"], {
      invalid_type_error:
        "ステータスは pending, accepted, rejected, expired のいずれかである必要があります",
    })
    .optional(),
  message: z.string().max(500, "メッセージは500文字以内で入力してください").optional(),
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
 * 特定の招待情報を取得
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; invitationId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const invitationId = params.invitationId;

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
      .select("id, name")
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

    // 招待の取得
    const { data: invitation, error } = await supabase
      .from("tenant_invitations")
      .select("id, email, role, status, created_at, expires_at, message, created_by")
      .eq("id", invitationId)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 結果が見つからない
        return NextResponse.json({ error: "招待が見つかりません" }, { status: 404 });
      }
      console.error("招待取得エラー:", error);
      return NextResponse.json({ error: "招待の取得に失敗しました" }, { status: 500 });
    }

    // 作成者の情報を取得
    let creatorInfo = null;
    if (invitation.created_by) {
      const { data: creator } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", invitation.created_by)
        .single();

      if (creator) {
        creatorInfo = creator;
      }
    }

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
      },
      invitation: {
        ...invitation,
        creator: creatorInfo,
      },
    });
  } catch (error) {
    console.error("招待取得エラー:", error);
    return NextResponse.json({ error: "招待の取得に失敗しました" }, { status: 500 });
  }
}

/**
 * 特定の招待を更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; invitationId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const invitationId = params.invitationId;

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

    // 招待の存在確認
    const { data: existingInvitation, error: invitationError } = await supabase
      .from("tenant_invitations")
      .select("id, status")
      .eq("id", invitationId)
      .eq("tenant_id", tenantId)
      .single();

    if (invitationError || !existingInvitation) {
      return NextResponse.json({ error: "招待が見つかりません" }, { status: 404 });
    }

    // 既に処理済みの招待は更新できない
    if (existingInvitation.status !== "pending") {
      return NextResponse.json(
        {
          error: "この招待は既に処理済みです",
          status: existingInvitation.status,
        },
        { status: 400 }
      );
    }

    // リクエストボディの検証
    const body = await request.json();
    const validationResult = updateInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const invitationData = validationResult.data;

    // 招待の更新
    const { data: updatedInvitation, error } = await supabase
      .from("tenant_invitations")
      .update({
        ...invitationData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invitationId)
      .eq("tenant_id", tenantId)
      .select("id, email, role, status, created_at, updated_at, expires_at, message")
      .single();

    if (error) {
      console.error("招待更新エラー:", error);
      return NextResponse.json({ error: "招待の更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ invitation: updatedInvitation });
  } catch (error) {
    console.error("招待更新エラー:", error);
    return NextResponse.json({ error: "招待の更新に失敗しました" }, { status: 500 });
  }
}

/**
 * 特定の招待を削除
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; invitationId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const invitationId = params.invitationId;

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

    // 招待の存在確認
    const { data: existingInvitation, error: invitationError } = await supabase
      .from("tenant_invitations")
      .select("id, email")
      .eq("id", invitationId)
      .eq("tenant_id", tenantId)
      .single();

    if (invitationError || !existingInvitation) {
      return NextResponse.json({ error: "招待が見つかりません" }, { status: 404 });
    }

    // 招待の削除
    const { error } = await supabase
      .from("tenant_invitations")
      .delete()
      .eq("id", invitationId)
      .eq("tenant_id", tenantId);

    if (error) {
      console.error("招待削除エラー:", error);
      return NextResponse.json({ error: "招待の削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: "招待を削除しました",
      deleted_invitation: {
        id: existingInvitation.id,
        email: existingInvitation.email,
      },
    });
  } catch (error) {
    console.error("招待削除エラー:", error);
    return NextResponse.json({ error: "招待の削除に失敗しました" }, { status: 500 });
  }
}
