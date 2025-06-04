---
name: Auctionタイプのプロパティ名不一致修正
about: current_priceとcurrent_highest_bidの不一致によるTypeScriptエラーの解決
title: 'bug: Auctionタイプのプロパティ名不一致修正（current_price vs current_highest_bid）'
labels: bug, high-priority, typescript
assignees: ''
---

## バグの説明
Auctionタイプにおいて、`current_price`と`current_highest_bid`という2つの異なるプロパティ名が混在して使用されており、TypeScriptエラーが発生しています。

```
src/app/widget/page.tsx:187:43 - error TS2339: Property 'current_price' does not exist on type 'Auction'.
src/hooks/use-realtime-auction.ts:209:30 - error TS2339: Property 'current_price' does not exist on type 'Auction'.
```

## 問題の詳細
1. 一部のファイルでは`current_price`を参照
   - `src/app/widget/page.tsx`
   - `src/hooks/use-realtime-auction.ts`
2. 型定義では`current_highest_bid`が正しいプロパティ名として定義
3. この不一致により、複数のTypeScriptエラーが発生

## 影響を受けるファイル
- `src/app/widget/page.tsx`: 複数箇所で`current_price`を参照
- `src/hooks/use-realtime-auction.ts`: 入札処理で`current_price`を参照
- `src/components/auction/auction-card.tsx`: `current_highest_bid`を使用

## 期待される修正
以下のいずれかの方法で一貫性を確保する必要があります：

1. **すべての`current_price`を`current_highest_bid`に変更**:
   - 型定義に合わせてコードを修正
   - すべての参照箇所を更新

2. **型定義を変更して`current_price`をサポート**:
   - 型定義に`current_price`を追加
   - または`current_highest_bid`を`current_price`に変更

## 推奨アプローチ
データベースのカラム名と一致する方を採用することを推奨します。Supabaseのテーブル定義を確認し、正しいプロパティ名に統一してください。

## 優先度
**高**: このエラーはTypeScriptのコンパイルを妨げ、ビルドとデプロイをブロックしています。

## 関連イシュー
- [ビルド失敗とTypeScriptエラーの修正](./build-and-typescript-errors.md)
