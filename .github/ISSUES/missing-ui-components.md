---
name: 不足しているUIコンポーネントの追加
about: TypeScriptエラーの原因となっている不足UIコンポーネントの実装
title: 'feature: 不足しているTooltipなどのUIコンポーネントの追加'
labels: feature, ui, blocking
assignees: ''
---

## 課題の説明
現在、プロジェクトで使用されているいくつかのUIコンポーネントが実装されていないか、正しくエクスポートされていないため、TypeScriptエラーが発生しています。特に`Tooltip`コンポーネントが見つからず、ビルドとコンパイルに影響しています。

## 不足しているコンポーネント
1. **Tooltip**: `@/components/ui/tooltip`
   - エラー: `Cannot find module '@/components/ui/tooltip' or its corresponding type declarations.`
   - 影響を受けるファイル: `src/components/pricing/AIPricingSuggestion.tsx`

2. **Dialog**: 既存の実装に問題があり、型エラーが発生
   - エラー: `Property 'className' does not exist on type 'DialogPortalProps'.`
   - 影響を受けるファイル: `src/components/ui/dialog.tsx`

## 期待される実装
1. **Tooltip**:
   - `src/components/ui/tooltip.tsx`ファイルの作成
   - 以下のコンポーネントのエクスポート:
     - `Tooltip`
     - `TooltipContent`
     - `TooltipProvider`
     - `TooltipTrigger`

2. **Dialog**:
   - 既存の`dialog.tsx`の修正
   - `DialogPortalProps`型の正しい使用

## 技術的要件
- コンポーネントはRadix UIベースで実装（プロジェクトの他のUIコンポーネントと一貫性を保つため）
- Tailwind CSSでスタイリング
- アクセシビリティ要件を満たすこと
- ダークモード対応

## 優先度
**高**: これらのコンポーネントの不足はTypeScriptエラーの原因となり、ビルドとデプロイをブロックしています。

## 参考実装
他のUIコンポーネント（例: `src/components/ui/button.tsx`）を参考に、同様のパターンで実装することを推奨します。

## 関連イシュー
- [ビルド失敗とTypeScriptエラーの修正](./build-and-typescript-errors.md)

## その他の情報
このプロジェクトではShadcn UIのパターンを採用しており、新しいコンポーネントもこの設計原則に従う必要があります。
