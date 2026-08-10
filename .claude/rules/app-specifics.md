# SVG Studio — アプリ固有仕様

このファイルは `<project-name>` = **SVG Studio** 固有の技術情報。
汎用ルール（Directory Rule、会話ログ、worktreeフロー）は親ディレクトリの
`CLAUDE.md` を参照。

---

## これは何か

ブラウザ内で完結するSVGビューア／変換ツール兼、素材コレクションサイト。
React + Vite の SPA。サーバーを持たず、静的ホスティングで動く。

- リポジトリ実体：`11_dev-svg-studio/`（独立したGitリポジトリ、`main`ブランチ、
  GitHub `sgtao/react-svg-studio` に接続済み）
- 公開先：GitHub Pages（`https://sgtao.github.io/react-svg-studio/`）

---

## 絶対に守ること

1. **プレビューへのDOM挿入は `safeSource` のみ。** `source` を
   `dangerouslySetInnerHTML` に渡さない
2. **コンポーネントから `manifest.generated.json` を直接importしない。** 必ず
   `src/content/index.ts` の関数を経由する
3. **`manifest.generated.json` を手で編集しない。** `npm run content` で再生成する
4. **`src/lib/` に React を持ち込まない。** 純粋関数のみ
5. **UI文言をコンポーネントに直書きしない。** `src/i18n/locales/*.json` の
   4言語すべてに追加する
6. **言語切替は `<Link>` によるページ遷移。** state での切り替えにしない
7. **`src/lib/` に手を入れたらテストも更新する。** ここは目視で壊れに気づけない層

> ⚠️ 運用メモ：特に2・3・7番は、`PreToolUse`フックで
> `manifest.generated.json`への直接Write/Editをブロックする等、機械的な強制に
> 昇格できる余地が大きい。現状はCLAUDE.md記載（お願いベース）のみ。

---

## コマンド

**実行場所**：以下はすべて `11_dev-svg-studio/` 内で実行する。

```bash
npm run dev        # 開発サーバー（起動前に content が走る）
npm run content    # content/ からマニフェストを再生成
npm run build      # 型チェック + 本番ビルド
npm test           # ユニットテスト（Vitest + jsdom、src/**/*.test.ts）
npm run typecheck  # 型のみ
```

素材を追加・削除したら `npm run content` を実行するまでアプリに反映されない。

---

## ディレクトリの役割

以下は `11_dev-svg-studio/` を起点としたパス。

| パス | 責務 |
|---|---|
| `content/` | 素材の原本とカテゴリ定義（唯一の編集対象） |
| `scripts/generate-manifest.mjs` | ビルド時のコンテンツ取り込み。将来のDB移行はここを差し替える |
| `src/lib/` | SVG解析・変換の純粋関数。React非依存 |
| `src/content/` | コンテンツ取得の唯一の窓口 |
| `src/state/` | ドキュメント状態（source が唯一の真実、検証結果は派生値） |
| `src/i18n/` | 辞書とロケール判定 |
| `src/components/` | 表示部品 |
| `src/components/ui/` | Chakra UIの基盤（`provider.tsx`／`color-mode.tsx`。next-themesベースのライト/ダーク） |
| `src/theme/` | Chakraのカスタムカラースケール・`AccentProvider`（Lime/Mint/Skyの3色アクセント、ライト/ダークとは独立） |
| `src/routes/` | URLと画面の対応 |

---

## 実装後に想定される既知の制約（設計時点での前提）

- SPAのため初期HTMLに本文が無い（T-05 のプリレンダリングで解消予定）
- テストは `src/lib/` のみを対象にする想定。canvas 依存の `rasterize` と画面のE2Eは
  対象外
- 対応言語は en / ja / zh / es の4つ
- 素材ページ間を移動すると編集中の内容は破棄される
