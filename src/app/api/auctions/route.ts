import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/auctions - オークション一覧取得
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") || "active";
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from("auctions")
      .select("*, profiles(username, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      auctions: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching auctions:", error);
    return NextResponse.json({ error: "オークション一覧の取得に失敗しました" }, { status: 500 });
  }
}

// POST /api/auctions - 新規オークション作成
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    // セッションからユーザーIDを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // バリデーション
    const { title, description, start_time, end_time, starting_price, image_url } = body;

    if (!title || !start_time || !end_time || starting_price === undefined) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    // オークション作成
    const { data, error } = await supabase
      .from("auctions")
      .insert({
        user_id: userId,
        title,
        description,
        start_time,
        end_time,
        starting_price,
        image_url,
        status: new Date(start_time) <= new Date() ? "active" : "pending",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating auction:", error);
    return NextResponse.json({ error: "オークションの作成に失敗しました" }, { status: 500 });
  }
}

// PATCH /api/auctions/:id - オークション更新
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const id = params.id; // paramsを使用するように修正

  if (!id) {
    return NextResponse.json({ error: "オークションIDが指定されていません" }, { status: 400 });
  }

  try {
    // セッションからユーザーIDを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // オークションの所有者確認
    const { data: auction, error: fetchError } = await supabase
      .from("auctions")
      .select("user_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !auction) {
      return NextResponse.json({ error: "オークションが見つかりません" }, { status: 404 });
    }

    if (auction.user_id !== userId) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    // 終了したオークションは更新不可
    if (["ended", "cancelled"].includes(auction.status)) {
      return NextResponse.json({ error: "終了したオークションは更新できません" }, { status: 400 });
    }

    // 更新可能なフィールドのみ抽出
    const { title, description, image_url, status } = body;
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (status !== undefined && ["pending", "active", "cancelled"].includes(status)) {
      updateData.status = status;
    }

    // 開始前のオークションのみ開始・終了時間を変更可能
    if (auction.status === "pending") {
      if (body.start_time !== undefined) updateData.start_time = body.start_time;
      if (body.end_time !== undefined) updateData.end_time = body.end_time;
      if (body.starting_price !== undefined) updateData.starting_price = body.starting_price;
    }

    updateData.updated_at = new Date().toISOString();

    // オークション更新
    const { data, error } = await supabase
      .from("auctions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error updating auction:", error);
    return NextResponse.json({ error: "オークションの更新に失敗しました" }, { status: 500 });
  }
}

// DELETE /api/auctions/:id - オークション削除
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "オークションIDが指定されていません" }, { status: 400 });
  }

  try {
    // セッションからユーザーIDを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userId = session.user.id;

    // オークションの所有者確認
    const { data: auction, error: fetchError } = await supabase
      .from("auctions")
      .select("user_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !auction) {
      return NextResponse.json({ error: "オークションが見つかりません" }, { status: 404 });
    }

    if (auction.user_id !== userId) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    // アクティブなオークションは削除不可
    if (auction.status === "active") {
      return NextResponse.json(
        { error: "アクティブなオークションは削除できません。キャンセルしてください。" },
        { status: 400 }
      );
    }

    // オークション削除
    const { error } = await supabase.from("auctions").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting auction:", error);
    return NextResponse.json({ error: "オークションの削除に失敗しました" }, { status: 500 });
  }
}
