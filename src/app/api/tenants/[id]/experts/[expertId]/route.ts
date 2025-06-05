import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

// 専門家更新スキーマ
const updateExpertSchema = z.object({
  role: z.enum(["admin", "expert"]).optional(),
  specialties: z.array(z.string()).optional(),
  hourly_rate: z.number().min(0, "時間単価は0以上である必要があります").optional(),
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
 * 特定の専門家情報を取得
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; expertId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const expertId = params.expertId;

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

    // 専門家情報の取得
    const { data: expert, error } = await supabase
      .from("tenant_experts")
      .select(
        `
        *,
        users:user_id (
          id,
          email,
          display_name,
          avatar_url,
          bio,
          created_at
        )
      `
      )
      .eq("id", expertId)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      console.error("専門家情報取得エラー:", error);
      return NextResponse.json({ error: "専門家情報の取得に失敗しました" }, { status: 500 });
    }

    if (!expert) {
      return NextResponse.json({ error: "専門家が見つかりません" }, { status: 404 });
    }

    // 専門家のオークション実績を取得
    const { data: auctionStats, error: statsError } = await supabase.rpc(
      "get_expert_auction_stats",
      { expert_user_id: expert.user_id, tenant_id_param: tenantId }
    );

    if (statsError) {
      console.warn("専門家オークション実績取得エラー:", statsError);
      // エラーがあっても処理は続行
    }

    return NextResponse.json({
      expert,
      stats: auctionStats || {
        total_auctions: 0,
        won_auctions: 0,
        total_revenue: 0,
        avg_bid_amount: 0,
      },
    });
  } catch (error) {
    console.error("専門家情報取得エラー:", error);
    return NextResponse.json({ error: "専門家情報の取得に失敗しました" }, { status: 500 });
  }
}

/**
 * 専門家情報を更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; expertId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const expertId = params.expertId;

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

    // 専門家の存在確認
    const { data: expert, error: expertError } = await supabase
      .from("tenant_experts")
      .select("id, user_id")
      .eq("id", expertId)
      .eq("tenant_id", tenantId)
      .single();

    if (expertError || !expert) {
      return NextResponse.json({ error: "専門家が見つかりません" }, { status: 404 });
    }

    // テナントオーナーの場合、ロールを変更できないようにする
    if (expert.user_id === tenant.owner_id) {
      const body = await request.json();
      if (body.role && body.role !== "admin") {
        return NextResponse.json(
          {
            error: "テナントオーナーのロールは変更できません",
          },
          { status: 400 }
        );
      }
    }

    // リクエストボディの検証
    const body = await request.json();
    const validationResult = updateExpertSchema.safeParse(body);

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

    // 専門家情報の更新
    const { data: updatedExpert, error } = await supabase
      .from("tenant_experts")
      .update(updateData)
      .eq("id", expertId)
      .eq("tenant_id", tenantId)
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
      console.error("専門家情報更新エラー:", error);
      return NextResponse.json({ error: "専門家情報の更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ expert: updatedExpert });
  } catch (error) {
    console.error("専門家情報更新エラー:", error);
    return NextResponse.json({ error: "専門家情報の更新に失敗しました" }, { status: 500 });
  }
}

/**
 * 専門家をテナントから削除
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; expertId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const tenantId = params.id;
    const expertId = params.expertId;

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

    // 専門家の存在確認
    const { data: expert, error: expertError } = await supabase
      .from("tenant_experts")
      .select("id, user_id")
      .eq("id", expertId)
      .eq("tenant_id", tenantId)
      .single();

    if (expertError || !expert) {
      return NextResponse.json({ error: "専門家が見つかりません" }, { status: 404 });
    }

    // テナントオーナーは削除できないようにする
    if (expert.user_id === tenant.owner_id) {
      return NextResponse.json(
        {
          error: "テナントオーナーをテナントから削除することはできません",
        },
        { status: 400 }
      );
    }

    // 専門家の削除
    const { data: deletedExpert, error } = await supabase
      .from("tenant_experts")
      .delete()
      .eq("id", expertId)
      .eq("tenant_id", tenantId)
      .select()
      .single();

    if (error) {
      console.error("専門家削除エラー:", error);
      return NextResponse.json({ error: "専門家の削除に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({
      message: "専門家をテナントから削除しました",
      expert: deletedExpert,
    });
  } catch (error) {
    console.error("専門家削除エラー:", error);
    return NextResponse.json({ error: "専門家の削除に失敗しました" }, { status: 500 });
  }
}
