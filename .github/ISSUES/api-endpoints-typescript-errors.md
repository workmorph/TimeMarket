# API エンドポイントの TypeScript エラー

## 概要
プロフィールと設定の API エンドポイント実装において、TypeScript エラーが発生しています。主に Supabase サーバークライアントのインポートパスと型の問題です。

## 詳細
以下のエラーが発生しています：

1. Supabase サーバークライアントのインポートエラー
```
Cannot find module '@/lib/supabase/server' or its corresponding type declarations.
```

2. 型の問題
```
Argument of type 'unknown' is not assignable to parameter of type 'string'.
Property 'working_hours' does not exist on type 'unknown'.
Property 'buffer_time' does not exist on type 'unknown'.
```

## 影響範囲
- `/src/app/api/profile/route.ts`
- `/src/app/api/settings/route.ts`

## 解決策
1. 正しい Supabase サーバークライアントのインポートパスを確認し修正する
2. `Record<string, unknown>` から特定のプロパティにアクセスする際に適切な型アサーションを追加する
3. 必要に応じて型定義を作成する

## 優先度
中

## ラベル
- bug
- typescript
- api

## 担当者
Agent 2 (Backend API)
