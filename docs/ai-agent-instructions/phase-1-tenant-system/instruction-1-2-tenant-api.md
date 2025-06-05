# 🎯 Instruction 1-2: テナント管理API実装

**Phase 1 - Step 2: テナントCRUD・専門家管理API構築**

---

## 📋 **指示概要**

### **タスク定義**

マルチテナントシステムのRESTful API実装

### **成果物**

- テナント管理APIエンドポイント群
- 専門家-テナント関連付けAPI
- セキュリティ・認証機能

### **所要時間見積**

- 実装: 6-8時間
- テスト: 2-3時間
- 合計: 8-11時間

---

## 🔧 **前提条件**

### **前ステップ完了確認**

```bash
# 前の指示の成果物確認
ls -la src/lib/supabase/tenant-types.ts
ls -la src/lib/supabase/tenant-helpers.ts

# テーブル存在確認
npx supabase db dump --schema public | grep "CREATE TABLE tenants"
```

### **依存関係確認**

- instruction-1-1-database.md が完了済み
- TypeScriptエラー 0件
- ビルド成功

---

## 📊 **実装タスク**

### **Task 1.2.1: テナント管理API作成**

#### **ファイル作成**: `src/app/api/tenants/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TenantService } from "@/lib/supabase/tenant-helpers";
import type { Tenant } from "@/lib/supabase/tenant-types";

const tenantService = new TenantService();

// テナント一覧取得
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenants = await tenantService.getUserTenants(session.user.id);

    return NextResponse.json({
      tenants,
      count: tenants.length,
    });
  } catch (error) {
    console.error("GET /api/tenants error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

// テナント作成
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, plan = "starter" } = body;

    // バリデーション
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // スラグ重複チェック
    const existingTenant = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingTenant.data) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const tenantData: Partial<Tenant> = {
      name,
      slug,
      plan,
      status: "active",
    };

    const tenant = await tenantService.createTenant(
      tenantData,
      session.user.id
    );

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tenants error:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}
```

#### **ファイル作成**: `src/app/api/tenants/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TenantService } from "@/lib/supabase/tenant-helpers";

const tenantService = new TenantService();

// テナント詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // テナントアクセス権確認
    const { data: userTenant } = await supabase
      .from("tenant_users")
      .select("role")
      .eq("tenant_id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (!userTenant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const tenant = await tenantService.getTenant(params.id);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error("GET /api/tenants/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

// テナント更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 管理者権限確認
    const { data: userTenant } = await supabase
      .from("tenant_users")
      .select("role")
      .eq("tenant_id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (!userTenant || !["owner", "admin"].includes(userTenant.role)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      "name",
      "brand_settings",
      "limits",
      "features",
      "custom_domain",
      "webhook_url",
    ];
    const updateData: Record<string, any> = {};

    // 許可されたフィールドのみ更新
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data: tenant, error } = await supabase
      .from("tenants")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error("PUT /api/tenants/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}
```

### **Task 1.2.2: 専門家管理API作成**

#### **ファイル作成**: `src/app/api/tenants/[id]/experts/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TenantService } from "@/lib/supabase/tenant-helpers";

const tenantService = new TenantService();

// テナント専門家一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // テナントアクセス権確認
    const { data: userTenant } = await supabase
      .from("tenant_users")
      .select("role")
      .eq("tenant_id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (!userTenant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 専門家情報を含む詳細取得
    const { data: experts, error } = await supabase
      .from("tenant_experts")
      .select(
        `
        *,
        expert:users!expert_id (
          id,
          name,
          email,
          avatar_url,
          bio
        )
      `
      )
      .eq("tenant_id", params.id)
      .eq("is_active", true);

    if (error) throw error;

    return NextResponse.json({
      experts: experts || [],
      count: experts?.length || 0,
    });
  } catch (error) {
    console.error("GET /api/tenants/[id]/experts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experts" },
      { status: 500 }
    );
  }
}

// 専門家をテナントに追加
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 管理者権限確認
    const { data: userTenant } = await supabase
      .from("tenant_users")
      .select("role")
      .eq("tenant_id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (!userTenant || !["owner", "admin"].includes(userTenant.role)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      expert_id,
      exclusive = false,
      hourly_rate,
      specialties = [],
      bio,
    } = body;

    if (!expert_id) {
      return NextResponse.json(
        { error: "Expert ID is required" },
        { status: 400 }
      );
    }

    // 専門家の存在確認
    const { data: expert } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", expert_id)
      .single();

    if (!expert || expert.role !== "expert") {
      return NextResponse.json({ error: "Expert not found" }, { status: 404 });
    }

    // 重複確認
    const { data: existing } = await supabase
      .from("tenant_experts")
      .select("id")
      .eq("tenant_id", params.id)
      .eq("expert_id", expert_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Expert already added to this tenant" },
        { status: 409 }
      );
    }

    const { data: tenantExpert, error } = await supabase
      .from("tenant_experts")
      .insert({
        tenant_id: params.id,
        expert_id,
        exclusive,
        hourly_rate,
        specialties,
        bio,
        is_active: true,
      })
      .select(
        `
        *,
        expert:users!expert_id (
          id,
          name,
          email,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;

    return NextResponse.json({ expert: tenantExpert }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tenants/[id]/experts error:", error);
    return NextResponse.json(
      { error: "Failed to add expert" },
      { status: 500 }
    );
  }
}
```

### **Task 1.2.3: API権限管理実装**

#### **ファイル作成**: `src/lib/auth/tenant-permissions.ts`

```typescript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export interface TenantPermission {
  tenantId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  permissions: string[];
}

export class TenantAuthService {
  private supabase = createRouteHandlerClient({ cookies });

  // テナントアクセス権確認
  async checkTenantAccess(
    tenantId: string,
    userId: string
  ): Promise<TenantPermission | null> {
    const { data, error } = await this.supabase
      .from("tenant_users")
      .select("role, permissions")
      .eq("tenant_id", tenantId)
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    return {
      tenantId,
      userId,
      role: data.role,
      permissions: data.permissions || [],
    };
  }

  // 管理者権限確認
  async requireAdminAccess(tenantId: string, userId: string): Promise<boolean> {
    const permission = await this.checkTenantAccess(tenantId, userId);
    return permission && ["owner", "admin"].includes(permission.role);
  }

  // オーナー権限確認
  async requireOwnerAccess(tenantId: string, userId: string): Promise<boolean> {
    const permission = await this.checkTenantAccess(tenantId, userId);
    return permission && permission.role === "owner";
  }

  // 特定権限確認
  async hasPermission(
    tenantId: string,
    userId: string,
    permissionName: string
  ): Promise<boolean> {
    const permission = await this.checkTenantAccess(tenantId, userId);
    if (!permission) return false;

    // オーナーは全権限
    if (permission.role === "owner") return true;

    return permission.permissions.includes(permissionName);
  }
}

// ミドルウェア用ヘルパー
export async function withTenantAuth(
  request: NextRequest,
  tenantId: string,
  requiredRole: "member" | "admin" | "owner" = "member"
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authService = new TenantAuthService();
  const permission = await authService.checkTenantAccess(
    tenantId,
    session.user.id
  );

  if (!permission) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const roleHierarchy = { member: 0, admin: 1, owner: 2 };
  if (roleHierarchy[permission.role] < roleHierarchy[requiredRole]) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return { session, permission };
}
```

---

## 🧪 **テスト手順**

### **Test 1.2.1: API接続テスト**

```bash
# 開発サーバー起動
npm run dev

# テスト用cURLコマンド
curl -X GET http://localhost:3000/api/tenants \
  -H "Cookie: supabase-auth-token=<your-token>"
```

### **Test 1.2.2: テナント作成テスト**

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -H "Cookie: supabase-auth-token=<your-token>" \
  -d '{"name": "Test Company", "slug": "test-company"}'
```

### **Test 1.2.3: TypeScript確認**

```bash
npm run type-check
npm run build
```

---

## ✅ **成功条件**

### **必須条件**

- [ ] 全APIエンドポイントが正常動作
- [ ] 認証・認可機能が動作
- [ ] TypeScriptエラー 0件
- [ ] データベース整合性維持
- [ ] セキュリティ要件満足

### **品質条件**

- [ ] API レスポンス時間 < 500ms
- [ ] エラーハンドリング適切
- [ ] ログ出力適切
- [ ] 既存機能に影響なし

---

## 📝 **GitHubコミット指示**

### **コミット実行**

```bash
git add .

git commit -m "feat(phase-1): [1-2] テナント管理API実装完了

- テナントCRUD API実装（/api/tenants）
- 専門家-テナント関連付けAPI実装（/api/tenants/[id]/experts）
- 権限管理システム実装（tenant-permissions.ts）
- セキュリティ・認証機能完備

Features:
- テナント作成・更新・削除
- 専門家の追加・管理
- ロールベースアクセス制御
- API権限管理

Tests:
- 全APIエンドポイント動作確認
- 認証・認可機能確認
- TypeScriptコンパイル成功
- ビルド成功

Refs: instruction-1-2-tenant-api.md"

git push origin main
```

---

## 🔗 **次の指示**

### **自動移行**

コミット完了後、以下の指示書に自動移行してください：

**次の指示**:
`docs/ai-agent-instructions/phase-1-tenant-system/instruction-1-3-tenant-ui.md`

### **移行条件**

- 全テストが成功している
- GitHubコミットが完了している
- エラーが発生していない

---

## 🚨 **エラー時の対処**

### **API テストエラー**

1. 認証トークンの有効性確認
2. データベース接続確認
3. エラーログの詳細確認

### **権限エラー**

1. RLS ポリシー確認
2. テナント・ユーザー関連付け確認
3. ロール設定確認

**問題発生時は詳細なエラーログと共にClaude に報告してください。**

---

**作成日**: 2025-06-05 15:30 JST  
**前の指示**: instruction-1-1-database.md  
**次の指示**: instruction-1-3-tenant-ui.md
