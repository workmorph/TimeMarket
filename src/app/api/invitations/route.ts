import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

// 招待検証スキーマ
const verifyInvitationSchema = z.object({
  token: z.string().min(1, "トークンは必須です"),
});

// 招待応答スキーマ
const respondToInvitationSchema = z.object({
  token: z.string().min(1, "トークンは必須です"),
  action: z.enum(["accept", "reject"], {
    invalid_type_error: "アクションは accept または reject である必要があります",
  }),
});

/**
 * 招待トークンを検証
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // リクエストボディの検証
    const body = await request.json();
    const validationResult = verifyInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { token } = validationResult.data;

    // 招待の検証
    const { data: invitation, error } = await supabase
      .from("tenant_invitations")
      .select("id, tenant_id, email, role, status, expires_at, tenants(id, name, slug)")
      .eq("token", token)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 結果が見つからない
        return NextResponse.json({ error: "無効な招待トークンです" }, { status: 404 });
      }
      console.error("招待検証エラー:", error);
      return NextResponse.json({ error: "招待の検証に失敗しました" }, { status: 500 });
    }

    // 招待の状態をチェック
    if (invitation.status !== "pending") {
      return NextResponse.json(
        {
          error: "この招待は既に処理済みです",
          status: invitation.status,
        },
        { status: 400 }
      );
    }

    // 有効期限をチェック
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);

    if (now > expiresAt) {
      // 招待を期限切れに更新
      await supabase
        .from("tenant_invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);

      return NextResponse.json({ error: "この招待は期限切れです" }, { status: 400 });
    }

    // 認証状態を確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 招待情報を返す
    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        tenant: invitation.tenants,
      },
      authenticated: !!user,
      email_match: user ? user.email === invitation.email : false,
    });
  } catch (error) {
    console.error("招待検証エラー:", error);
    return NextResponse.json({ error: "招待の検証に失敗しました" }, { status: 500 });
  }
}

/**
 * 招待に応答（受け入れまたは拒否）
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

    // リクエストボディの検証
    const body = await request.json();
    const validationResult = respondToInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力データが無効です",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { token, action } = validationResult.data;

    // 招待の検証
    const { data: invitation, error } = await supabase
      .from("tenant_invitations")
      .select("id, tenant_id, email, role, status, expires_at, tenants(id, name, slug)")
      .eq("token", token)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 結果が見つからない
        return NextResponse.json({ error: "無効な招待トークンです" }, { status: 404 });
      }
      console.error("招待検証エラー:", error);
      return NextResponse.json({ error: "招待の検証に失敗しました" }, { status: 500 });
    }

    // 招待の状態をチェック
    if (invitation.status !== "pending") {
      return NextResponse.json(
        {
          error: "この招待は既に処理済みです",
          status: invitation.status,
        },
        { status: 400 }
      );
    }

    // 有効期限をチェック
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);

    if (now > expiresAt) {
      // 招待を期限切れに更新
      await supabase
        .from("tenant_invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);

      return NextResponse.json({ error: "この招待は期限切れです" }, { status: 400 });
    }

    // メールアドレスの一致を確認
    if (user.email !== invitation.email) {
      return NextResponse.json(
        {
          error: "この招待は別のメールアドレス宛てに送信されています",
        },
        { status: 403 }
      );
    }

    // 招待を処理
    if (action === "accept") {
      // トランザクション的に処理
      // 1. 招待を受け入れ状態に更新
      const { error: updateError } = await supabase
        .from("tenant_invitations")
        .update({
          status: "accepted",
          updated_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);

      if (updateError) {
        console.error("招待更新エラー:", updateError);
        return NextResponse.json({ error: "招待の更新に失敗しました" }, { status: 500 });
      }

      // 2. テナントに専門家として追加
      const { error: addExpertError } = await supabase.from("tenant_experts").insert({
        tenant_id: invitation.tenant_id,
        user_id: user.id,
        role: invitation.role,
      });

      if (addExpertError) {
        console.error("専門家追加エラー:", addExpertError);
        return NextResponse.json({ error: "テナントへの追加に失敗しました" }, { status: 500 });
      }

      return NextResponse.json({
        message: "招待を受け入れました",
        tenant: invitation.tenants,
      });
    } else if (action === "reject") {
      // 招待を拒否状態に更新
      const { error: updateError } = await supabase
        .from("tenant_invitations")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);

      if (updateError) {
        console.error("招待更新エラー:", updateError);
        return NextResponse.json({ error: "招待の更新に失敗しました" }, { status: 500 });
      }

      return NextResponse.json({
        message: "招待を拒否しました",
      });
    } else {
      // この時点では到達しないはずだが、型安全性のため
      return NextResponse.json({ error: "無効なアクションです" }, { status: 400 });
    }
  } catch (error) {
    console.error("招待応答エラー:", error);
    return NextResponse.json({ error: "招待への応答に失敗しました" }, { status: 500 });
  }
}
