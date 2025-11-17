# Changelog

本文件記錄專案的主要 API 和資料庫變更，供全體團隊參考。

---

## [2025-11-17] - Google OAuth 認證整合

### 🎯 概述
本次更新整合了 NextAuth.js 5.0 與 Google OAuth 2.0 認證功能，實現第三方登入並自動處理用戶帳號連結。

### 📊 資料庫變更

#### 新增資料表

**1. Account 表**
- **用途**: 儲存 OAuth 提供者（如 Google）的帳號資訊
- **主要欄位**:
  - `id` (TEXT, Primary Key): 使用 cuid() 生成
  - `userId` (INTEGER): 關聯到 User 表的外鍵
  - `provider` (TEXT): OAuth 提供者名稱（如 "google"）
  - `providerAccountId` (TEXT): 提供者端的帳號 ID
  - `type` (TEXT): 帳號類型
  - `access_token`, `refresh_token`, `id_token` (TEXT, 可選): OAuth token
  - `expires_at` (INTEGER, 可選): Token 過期時間
- **索引**: 
  - `userId` 索引（用於快速查詢用戶的所有帳號）
  - `(provider, providerAccountId)` 唯一索引（確保同一提供者的帳號不重複）
- **外鍵關係**: 
  - `userId` → `User.id` (ON DELETE CASCADE)

**2. Session 表**
- **用途**: 儲存用戶會話資訊（使用 JWT 策略時可選）
- **主要欄位**:
  - `id` (TEXT, Primary Key): 使用 cuid() 生成
  - `sessionToken` (TEXT, Unique): 會話 token
  - `userId` (INTEGER): 關聯到 User 表的外鍵
  - `expires` (TIMESTAMP): 會話過期時間
- **索引**: 
  - `userId` 索引
  - `sessionToken` 唯一索引
- **外鍵關係**: 
  - `userId` → `User.id` (ON DELETE CASCADE)

**3. VerificationToken 表**
- **用途**: 儲存電子郵件驗證 token
- **主要欄位**:
  - `identifier` (TEXT): 識別符（通常是 email）
  - `token` (TEXT, Unique): 驗證 token
  - `expires` (TIMESTAMP): Token 過期時間
- **索引**: 
  - `token` 唯一索引
  - `(identifier, token)` 唯一索引

#### User 表變更

**新增欄位**:
- `name` (TEXT, 可選): 用戶顯示名稱（NextAuth.js 標準欄位）
- `emailVerified` (TIMESTAMP, 可選): 電子郵件驗證時間（NextAuth.js 標準欄位）

**欄位修改**:
- `password` (TEXT): 從 `NOT NULL` 改為可選（`NULL`），以支援 OAuth 使用者（無密碼）

**新增關聯**:
- `accounts`: 一對多關係，關聯到 `Account` 表
- `sessions`: 一對多關係，關聯到 `Session` 表

### 🔧 API 變更

#### NextAuth 配置更新 (`src/auth.ts`)

**新增配置**:
- `trustHost: true`: NextAuth.js 5.0 必要配置，用於處理主機信任

**新增 Callback**:
- `jwt` callback: 處理 JWT token 生成，將用戶 ID 添加到 token 中
- `session` callback: 更新 session 物件，從資料庫獲取最新的用戶資訊（name, image）

**功能說明**:
- PrismaAdapter 會自動處理以下邏輯：
  1. 檢查 `Account` 是否存在（通過 `provider` + `providerAccountId`）
  2. 如果 `Account` 存在，找到對應的 `User`
  3. 如果 `Account` 不存在：
     - 檢查 `User` 是否存在（通過 `email`）
     - 如果 `User` 存在，創建 `Account` 並連結到現有的 `User`
     - 如果 `User` 不存在，創建新的 `User` 和 `Account`

### 🔐 環境變數要求

確保以下環境變數已正確設置：

```env
# Google OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth 配置
AUTH_SECRET=your_auth_secret
```

### 📝 Migration 檔案

本次更新包含以下 migration：

1. **20251117055028_add_nextauth_models**
   - 創建 `Account`, `Session`, `VerificationToken` 表
   - 將 `User.password` 改為可選

2. **20251117055655_add_user_name_field**
   - 添加 `User.name` 欄位

3. **20251117062732_add_email_verified_field**
   - 添加 `User.emailVerified` 欄位

### 🚀 部署注意事項

1. **資料庫 Migration**:
   ```bash
   pnpm prisma migrate deploy
   ```

2. **重新生成 Prisma Client**:
   ```bash
   pnpm prisma generate
   ```

3. **Google Cloud Console 設定**:
   - 已授權的 JavaScript 來源: `https://your-domain.com`
   - 已授權的重新導向 URI: `https://your-domain.com/api/auth/callback/google`

### ✅ 測試檢查清單

- [ ] Google OAuth 登入功能正常
- [ ] 新用戶通過 Google 登入時自動創建帳號
- [ ] 現有用戶通過 Google 登入時正確連結帳號
- [ ] Credentials 登入功能不受影響
- [ ] Session 資訊正確更新（包含 name, image）

### 🔄 向後相容性

- ✅ 現有的 Credentials 登入功能完全相容
- ✅ 現有用戶資料不受影響（`password` 欄位仍可正常使用）
- ✅ 現有的 API 端點無變更

### 📚 相關文件

- NextAuth.js 5.0 文件: https://authjs.dev/
- Prisma Adapter 文件: https://authjs.dev/getting-started/adapters/prisma
- Google OAuth 設定指南: https://console.cloud.google.com/

---

## 變更記錄格式說明

- **日期格式**: YYYY-MM-DD
- **標籤說明**:
  - 🎯 概述: 本次更新的主要目的
  - 📊 資料庫變更: 資料庫結構變更
  - 🔧 API 變更: API 端點或配置變更
  - 🔐 環境變數: 新增或變更的環境變數
  - 📝 Migration: 資料庫 migration 檔案
  - 🚀 部署: 部署時需要注意的事項
  - ✅ 測試: 測試檢查清單
  - 🔄 相容性: 向後相容性說明

---

**最後更新**: 2025-11-17  
**維護者**: 開發團隊

