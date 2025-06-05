"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase/types";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    setIsLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    setProfile(error ? null : (data as Profile));
    setIsLoading(false);
  }

  // ログイン関数
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  // サインアップ関数
  async function signUp(email: string, password: string, userData: Partial<Profile>) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      // プロフィールを作成
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        user_id: authData.user.id,
        display_name: userData.display_name || email.split("@")[0] || "Unknown User",
        verification_status: "pending",
        total_sessions: 0,
        average_rating: 0,
        response_rate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...userData,
      });

      if (profileError) {
        console.error("プロフィール作成エラー:", profileError);
      }
    }

    return authData;
  }

  // ログアウト関数
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  // プロフィール更新関数
  async function updateProfile(profileData: Partial<Profile>) {
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setProfile(data as Profile);
    return data;
  }

  return {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
