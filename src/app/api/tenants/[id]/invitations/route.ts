import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

// 招待作成スキーマ
const createInvitationSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  role: z.enum(["member", "admin"], {
    invalid_type_error: "ロールは member または admin である必要があります",
  }),
  message: z.string().max(500, "メッセージは500文字以内で入力してください").optional(),
});

// 招待一括作成スキーマ
const createBulkInvitationsSchema = z.object({
  invitations: z
    .array(
      z.object({
        email: z.string().email("有効なメールアドレスを入力してください"),
        role: z.enum(["member", "admin"], {
          invalid_type_error: "ロールは member または admin である必要があります",
        }),
      })
    )
    .min(1, "少なくとも1つの招待が必要です"),
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
 * 招待トークンを生成する
 */
function generateInvitationToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * テナントの招待一覧を取得
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
    const { data: invitations, error } = await supabase
      .from("tenant_invitations")
      .select("id, email, role, status, created_at, expires_at, created_by")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("招待取得エラー:", error);
      return NextResponse.json({ error: "招待の取得に失敗しました" }, { status: 500 });
    }

    // 招待者の情報を取得
    const creatorIds = invitations.map((invitation) => invitation.created_by).filter(Boolean);

    let creators = {};

    if (creatorIds.length > 0) {
      const { data: creatorProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", creatorIds);

      if (creatorProfiles) {
        creators = creatorProfiles.reduce(
          (
            acc: Record<
              string,
              { id: string; full_name: string | null; avatar_url: string | null }
            >,
            profile
          ) => {
            acc[profile.id] = profile;
            return acc;
          },
          {}
        );
      }
    }

    // 招待情報に作成者情報を追加
    const invitationsWithCreator = invitations.map((invitation) => ({
      ...invitation,
      creator: invitation.created_by
        ? (
            creators as Record<
              string,
              { id: string; full_name: string | null; avatar_url: string | null }
            >
          )[invitation.created_by]
        : null,
    }));

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
      },
      invitations: invitationsWithCreator,
    });
  } catch (error) {
    console.error("招待一覧取得エラー:", error);
    return NextResponse.json({ error: "招待一覧の取得に失敗しました" }, { status: 500 });
  }
}

/**
 * 新しい招待を作成
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
      .select("id, name, slug")
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

    // 単一の招待か一括招待かを判断
    let invitationsToCreate = [];
    let message = "";

    if (Array.isArray(body.invitations)) {
      // 一括招待の場合
      const validationResult = createBulkInvitationsSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "入力データが無効です",
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      invitationsToCreate = validationResult.data.invitations;
      message = validationResult.data.message || "";
    } else {
      // 単一招待の場合
      const validationResult = createInvitationSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "入力データが無効です",
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      invitationsToCreate = [
        {
          email: validationResult.data.email,
          role: validationResult.data.role,
        },
      ];
      message = validationResult.data.message || "";
    }

    // 重複メールアドレスを除去
    const uniqueEmails = [...new Set(invitationsToCreate.map((inv) => inv.email.toLowerCase()))];

    // 既存ユーザーと既存招待をチェック
    // TODO: 既存ユーザー情報は将来の機能で使用予定
    // const { data: existingUsers } = await supabase
    //   .from('profiles')
    //   .select('id, email')
    //   .in('email', uniqueEmails)

    const { data: existingExperts } = await supabase
      .from("tenant_experts")
      .select("user_id, profiles(email)")
      .eq("tenant_id", tenantId)
      .in("profiles.email", uniqueEmails);

    const { data: existingInvitations } = await supabase
      .from("tenant_invitations")
      .select("email")
      .eq("tenant_id", tenantId)
      .eq("status", "pending")
      .in("email", uniqueEmails);

    // 既に招待済みのメールアドレス
    const alreadyInvitedEmails = new Set(
      existingInvitations?.map((inv) => inv.email.toLowerCase()) || []
    );

    // 既にテナントに所属しているメールアドレス
    const alreadyMemberEmails = new Set(
      existingExperts
        ?.map((exp) => (exp.profiles as { email?: string } | null)?.email?.toLowerCase())
        .filter(Boolean) || []
    );

    // 招待を作成
    const results = [];
    const createdInvitations = [];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7日後に有効期限

    for (const invitation of invitationsToCreate) {
      const email = invitation.email.toLowerCase();

      // 既にテナントのメンバーの場合はスキップ
      if (alreadyMemberEmails.has(email)) {
        results.push({
          email,
          status: "skipped",
          reason: "already_member",
        });
        continue;
      }

      // 既に招待済みの場合はスキップ
      if (alreadyInvitedEmails.has(email)) {
        results.push({
          email,
          status: "skipped",
          reason: "already_invited",
        });
        continue;
      }

      // 招待を作成
      const token = generateInvitationToken();

      createdInvitations.push({
        tenant_id: tenantId,
        email,
        role: invitation.role,
        token,
        status: "pending",
        message,
        created_by: user.id,
        expires_at: expiresAt.toISOString(),
      });

      results.push({
        email,
        status: "created",
        role: invitation.role,
      });
    }

    // 招待をデータベースに保存
    if (createdInvitations.length > 0) {
      const { error } = await supabase
        .from("tenant_invitations")
        .insert(createdInvitations)
        .select("id, email, role, status, created_at, expires_at");

      if (error) {
        console.error("招待作成エラー:", error);
        return NextResponse.json({ error: "招待の作成に失敗しました" }, { status: 500 });
      }

      // TODO: ここで招待メールを送信する処理を実装
      // 招待メールの送信は別途実装予定
    }

    return NextResponse.json(
      {
        results,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("招待作成エラー:", error);
    return NextResponse.json({ error: "招待の作成に失敗しました" }, { status: 500 });
  }
}

/**
 * 招待を一括削除
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

    if (!Array.isArray(body.invitation_ids)) {
      return NextResponse.json({ error: "invitation_idsの配列が必要です" }, { status: 400 });
    }

    // 招待の削除
    const { data, error } = await supabase
      .from("tenant_invitations")
      .delete()
      .in("id", body.invitation_ids)
      .eq("tenant_id", tenantId) // 念のため、指定されたテナントの招待のみを削除
      .select("id, email");

    if (error) {
      console.error("招待削除エラー:", error);
      return NextResponse.json({ error: "招待の削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length}件の招待を削除しました`,
      deleted_invitations: data,
    });
  } catch (error) {
    console.error("招待削除エラー:", error);
    return NextResponse.json({ error: "招待の削除に失敗しました" }, { status: 500 });
  }
}
