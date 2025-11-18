# BushiGear

> 世界の闘志に、日本の誇りを。

Next.js 15 と React 19 で構築された日本製格闘用品の EC プラットフォーム。

**言語:** [English](README.md) | [中文](README.ch.md) | [日本語](#)

## 機能

- 🛍️ **EC 機能** - 商品カタログ、カート、決済、注文管理
- 🤖 **AI アシスタント** - OpenAI によるチャットと商品推薦
- 🌐 **多言語対応** - 日本語、英語、中国語
- 🔐 **認証** - NextAuth（Google OAuth + 認証情報）
- 💳 **決済** - Stripe による安全な決済
- 💬 **レビュー** - 商品コメントと評価
- ❤️ **お気に入り** - 気に入った商品を保存
- 🔍 **RAG** - ベクトル埋め込みによる商品検索

## 技術スタック

- **フレームワーク:** Next.js 15.3.5（App Router, Turbopack）
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **データベース:** PostgreSQL（Neon serverless）+ Prisma ORM
- **認証:** NextAuth 5.0（Google OAuth + 認証情報）
- **AI:** Vercel AI SDK（OpenAI gpt-4o-mini, DALL-E 3）
- **決済:** Stripe
- **アニメーション:** Motion（Framer Motion）

## セットアップ

### 必要環境

- Node.js 18+
- pnpm（推奨）または npm
- PostgreSQL データベース（Neon 推奨）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/bushigear.git
cd bushigear

# 依存関係をインストール
pnpm install

# 環境変数を設定
# .env ファイルを作成して設定を入力（下記の環境変数を参照）

# データベースをセットアップ
pnpm db:push
pnpm db:generate

# 開発サーバーを起動
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開いてアプリを確認。

### 環境変数

```env
DATABASE_URL=あなたの_postgresql_接続文字列
NEXTAUTH_SECRET=あなたの_nextauth_シークレット
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=あなたの_google_client_id
GOOGLE_CLIENT_SECRET=あなたの_google_client_secret
OPENAI_API_KEY=あなたの_openai_api_キー
STRIPE_SECRET_KEY=あなたの_stripe_シークレットキー
STRIPE_PUBLISHABLE_KEY=あなたの_stripe_公開キー
```

## スクリプト

- `pnpm dev` - 開発サーバーを起動（Turbopack）
- `pnpm build` - 本番用ビルド
- `pnpm start` - 本番サーバーを起動
- `pnpm lint` - ESLint を実行
- `pnpm db:generate` - Prisma client を生成
- `pnpm db:push` - データベース schema をプッシュ
- `pnpm db:migrate` - データベースマイグレーションを実行

## プロジェクト構造

```
src/
├── app/              # Next.js App Router ページと API ルート
├── components/       # React コンポーネント（layout, common, ui）
├── lib/              # ユーティリティとヘルパー
├── data/             # 静的データ（content.json）
└── contexts/         # React contexts
```

## ライセンス

プライベート - 全著作権所有

---

世界中の格闘技愛好者のために ❤️

