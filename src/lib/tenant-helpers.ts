/**
 * テナント管理ヘルパー関数
 * マルチテナントSaaS機能のためのヘルパークラス
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { Tenant, TenantExpert } from "./supabase/types";

/**
 * テナント管理サービスクラス
 */
export class TenantService {
  private supabase!: SupabaseClient;

  /**
   * コンストラクタ
   * @param supabaseClient Supabaseクライアントインスタンス（省略時は新規作成）
   */
  constructor(supabaseClient?: SupabaseClient) {
    if (supabaseClient) {
      this.supabase = supabaseClient;
    } else {
      // サーバーサイドで実行する場合は新しいクライアントを作成
      this.initializeClient();
    }
  }

  /**
   * サーバーサイドでのクライアント初期化
   * 非同期処理を同期的に扱うための内部メソッド
   */
  private async initializeClient() {
    this.supabase = await createClient();
  }

  /**
   * テナント一覧を取得
   * @param options 取得オプション
   * @returns テナント一覧
   */
  async getTenants(options?: { isActive?: boolean }) {
    try {
      let query = this.supabase.from("tenants").select("*");

      // アクティブなテナントのみフィルタリング
      if (options?.isActive !== undefined) {
        query = query.eq("is_active", options.isActive);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Tenant[];
    } catch (error) {
      console.error("テナント一覧取得エラー:", error);
      throw error;
    }
  }

  /**
   * ユーザーが所属するテナント一覧を取得
   * @param userId ユーザーID
   * @returns テナント一覧
   */
  async getUserTenants(userId: string) {
    try {
      // ユーザーが所有者のテナント
      const { data: ownedTenants, error: ownedError } = await this.supabase
        .from("tenants")
        .select("*")
        .eq("owner_id", userId);

      if (ownedError) {
        throw ownedError;
      }

      // ユーザーが専門家または管理者として所属するテナント
      const { data: memberTenants, error: memberError } = await this.supabase
        .from("tenant_experts")
        .select(
          `
          tenant_id,
          role,
          tenants:tenant_id (*)
        `
        )
        .eq("user_id", userId);

      if (memberError) {
        throw memberError;
      }

      // 結果を結合
      // tenants プロパティは Tenant 型のオブジェクトを含む
      const memberTenantsData = memberTenants.map((item) => ({
        ...(item.tenants as unknown as Tenant),
        role: item.role,
      }));

      return [...ownedTenants, ...memberTenantsData] as Tenant[];
    } catch (error) {
      console.error("ユーザーテナント一覧取得エラー:", error);
      throw error;
    }
  }

  /**
   * テナントの専門家一覧を取得
   * @param tenantId テナントID
   * @returns 専門家一覧
   */
  async getTenantExperts(tenantId: string) {
    try {
      const { data, error } = await this.supabase
        .from("tenant_experts")
        .select(
          `
          *,
          profile:user_id (
            id,
            display_name,
            email,
            avatar_url,
            expertise_areas,
            bio,
            hourly_rate,
            verification_status
          )
        `
        )
        .eq("tenant_id", tenantId);

      if (error) {
        throw error;
      }

      return data as TenantExpert[];
    } catch (error) {
      console.error("テナント専門家一覧取得エラー:", error);
      throw error;
    }
  }

  /**
   * テナントを作成
   * @param tenantData テナント作成データ
   * @param ownerId 所有者ユーザーID
   * @returns 作成されたテナント
   */
  async createTenant(
    tenantData: { name: string; slug: string; description?: string; logo_url?: string },
    ownerId: string
  ) {
    try {
      // トランザクション的に処理
      // 1. テナント作成
      const { data: tenant, error: tenantError } = await this.supabase
        .from("tenants")
        .insert({
          name: tenantData.name,
          slug: tenantData.slug,
          description: tenantData.description || null,
          logo_url: tenantData.logo_url || null,
          owner_id: ownerId,
        })
        .select()
        .single();

      if (tenantError) {
        throw tenantError;
      }

      // 2. 所有者を管理者として追加
      const { error: expertError } = await this.supabase.from("tenant_experts").insert({
        tenant_id: tenant.id,
        user_id: ownerId,
        role: "admin",
        is_public: true,
      });

      if (expertError) {
        // ロールバック的な処理（テナントを削除）
        await this.supabase.from("tenants").delete().eq("id", tenant.id);
        throw expertError;
      }

      return tenant as Tenant;
    } catch (error) {
      console.error("テナント作成エラー:", error);
      throw error;
    }
  }
}
