# BushiGear

> 武魂上身，榮耀出征

基於 Next.js 15 和 React 19 構建的日本格鬥用品電商平台。

[English](README.md) | [中文](README.cn.md) | [日本語](README.ja.md)

## 功能特色

- 🛍️ **電商系統** - 商品目錄、購物車、結帳與訂單管理
- 🤖 **AI 助手** - OpenAI 驅動的聊天與商品推薦
- 🌐 **多語言** - 支援日文、英文、中文
- 🔐 **身份驗證** - NextAuth（Google OAuth + 帳密登入）
- 💳 **支付** - Stripe 安全結帳
- 💬 **評論** - 商品評價與評分
- ❤️ **收藏** - 儲存喜愛商品
- 🔍 **RAG** - 向量嵌入智能商品搜尋

## 技術棧

- **框架:** Next.js 15.3.5（App Router, Turbopack）
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **資料庫:** PostgreSQL（Neon serverless）+ Prisma ORM
- **認證:** NextAuth 5.0（Google OAuth + 帳密）
- **AI:** Vercel AI SDK（OpenAI gpt-4o-mini, DALL-E 3）
- **支付:** Stripe
- **動畫:** Motion（Framer Motion）

## 快速開始

### 環境需求

- Node.js 18+
- pnpm（推薦）或 npm
- PostgreSQL 資料庫（推薦 Neon）

### 安裝步驟

```bash
# 克隆專案
git clone https://github.com/yourusername/bushigear.git
cd bushigear

# 安裝依賴
pnpm install

# 設定環境變數
# 建立 .env 檔案並填入你的配置（見下方環境變數說明）

# 設定資料庫
pnpm db:push
pnpm db:generate

# 啟動開發伺服器
pnpm dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用。

### 環境變數

```env
DATABASE_URL=你的_postgresql_連線字串
NEXTAUTH_SECRET=你的_nextauth_密鑰
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=你的_google_client_id
GOOGLE_CLIENT_SECRET=你的_google_client_secret
OPENAI_API_KEY=你的_openai_api_金鑰
STRIPE_SECRET_KEY=你的_stripe_密鑰
STRIPE_PUBLISHABLE_KEY=你的_stripe_公開金鑰
```

## 指令

- `pnpm dev` - 啟動開發伺服器（Turbopack）
- `pnpm build` - 建置生產版本
- `pnpm start` - 啟動生產伺服器
- `pnpm lint` - 執行 ESLint
- `pnpm db:generate` - 生成 Prisma client
- `pnpm db:push` - 推送資料庫 schema
- `pnpm db:migrate` - 執行資料庫遷移

## 專案結構

```text
src/
├── app/              # Next.js App Router 頁面與 API 路由
├── components/       # React 元件（layout, common, ui）
├── lib/              # 工具函數與輔助程式
├── data/             # 靜態資料（content.json）
└── contexts/         # React contexts
```

## 授權

私有專案 - 版權所有

---

為全球格鬥愛好者而建 ❤️
