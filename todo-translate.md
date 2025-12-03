# Translation Todo List for next-intl Integration

本文件列出專案中所有需要移至 `content.json` 的 hard-coded 文字，以便整合 next-intl。

## 說明
- ✅ = 已在 content.json 中
- ❌ = 需要新增到 content.json
- 🔄 = 需要重構以支援多語言

---

## 1. Navigation (導覽列)

### `src/components/layout/nav.tsx`
- ❌ `"会員登録 | ログイン"` (line 81) - Tooltip for login button
- ❌ `"お気に入り"` (line 93) - Tooltip for favorites button
- ❌ `"言語切り替え"` (line 108) - Tooltip for language switcher

**建議結構:**
```json
{
  "nav": {
    "tooltips": {
      "login": { "jp": "会員登録 | ログイン", "en": "Register | Login", "cn": "註冊 | 登入" },
      "favorites": { "jp": "お気に入り", "en": "Favorites", "cn": "收藏" },
      "language": { "jp": "言語切り替え", "en": "Switch Language", "cn": "切換語言" }
    }
  }
}
```

---

## 2. Search (搜尋功能)

### `src/components/common/SearchResults.tsx`
- ❌ `"検索中..."` (line 29) - Loading state
- ❌ `"該当する商品が見つかりませんでした"` (line 39) - No results
- ❌ `"検索結果"` (line 48) - Search results heading

### `src/components/common/SearchBar.tsx`
- ❌ `"検索に失敗しました"` (line 45) - Search error
- ❌ `"商品を検索..."` (line 82) - Placeholder

**建議結構:**
```json
{
  "search": {
    "loading": { "jp": "検索中...", "en": "Searching...", "cn": "搜尋中..." },
    "noResults": { "jp": "該当する商品が見つかりませんでした", "en": "No products found", "cn": "找不到相關商品" },
    "results": { "jp": "検索結果", "en": "Search Results", "cn": "搜尋結果" },
    "error": { "jp": "検索に失敗しました", "en": "Search failed", "cn": "搜尋失敗" },
    "placeholder": { "jp": "商品を検索...", "en": "Search products...", "cn": "搜尋商品..." }
  }
}
```

---

## 3. Authentication (認證)

### `src/app/login/page.tsx`
- ❌ `"読み込み中..."` (line 31) - Loading
- ❌ `"ログイン済み"` (line 40) - Already logged in
- ❌ `"ようこそ、{email}"` (line 41) - Welcome message
- ❌ `"ログアウト"` (line 47) - Logout button
- ❌ `"ログインに失敗しました。メールアドレスとパスワードを確認してください。"` (line 67) - Login error
- ❌ `"予期しないエラーが発生しました。もう一度お試しください。"` (line 73) - Unexpected error
- ❌ `"Googleログインに失敗しました。もう一度お試しください。"` (line 85) - Google login error
- ❌ `"ログイン"` (line 92) - Page title
- ❌ `"Email"` (line 105) - Email label
- ❌ `"Password"` (line 117) - Password label
- ❌ `"ログイン中..."` (line 136) - Logging in
- ❌ `"ログイン"` (line 139) - Login button
- ❌ `"または"` (line 146) - Or separator
- ❌ `"Googleでログイン中..."` (line 159) - Google logging in
- ❌ `"Googleでログイン"` (line 162) - Google login button
- ❌ `"新規登録は"` (line 167) - Register link prefix
- ❌ `"こちら"` (line 172) - Register link text

### `src/app/register/page.tsx`
- ❌ `"画像ファイルを選択してください"` (line 58) - Image file error
- ❌ `"ファイルサイズは5MB以下にしてください"` (line 63) - File size error
- ❌ `"アップロードに失敗しました"` (line 81, 87) - Upload error
- ❌ `"姓を入力してください。"` (line 98) - Last name required
- ❌ `"名を入力してください。"` (line 102) - First name required
- ❌ `"郵便番号は 123-4567 の形式（半角）で入力してください。"` (line 106) - Postal code format
- ❌ `"都道府県を選択してください。"` (line 110) - Prefecture required
- ❌ `"市区町村を入力してください。"` (line 114) - City required
- ❌ `"丁目・番地・号を入力してください。"` (line 118) - Street required
- ❌ `"丁目・番地・号の数字は半角で入力してください。"` (line 122) - Street number format
- ❌ `"登録に失敗しました"` (line 154) - Registration failed
- ❌ `"Google登録に失敗しました。もう一度お試しください。"` (line 169) - Google registration error
- ❌ `"新規登録"` (line 176) - Page title
- ❌ `"プロフィール画像（任意）"` (line 187) - Profile image label
- ❌ `"アップロード中..."` (line 213) - Uploading
- ❌ `"氏"` (line 220) - Last name label
- ❌ `"名"` (line 232) - First name label
- ❌ `"性別"` (line 268) - Gender label
- ❌ `"選択してください"` (line 278) - Select placeholder
- ❌ `"男性"` (line 279) - Male option
- ❌ `"女性"` (line 280) - Female option
- ❌ `"その他"` (line 281) - Other option
- ❌ `"住所"` (line 285) - Address section
- ❌ `"郵便番号（半角数字）"` (line 287) - Postal code label
- ❌ `"都道府県"` (line 300) - Prefecture label
- ❌ `"市区町村"` (line 318) - City label
- ❌ `"丁目・番地・号（数字は半角）"` (line 330) - Street label
- ❌ `"建物名／会社名（任意）"` (line 343) - Building label
- ❌ `"部屋番号（任意）"` (line 356) - Room label
- ❌ `"誕生日"` (line 368) - Birthday label
- ❌ `"登録中..."` (line 387) - Registering
- ❌ `"登録"` (line 390) - Register button
- ❌ `"Googleで登録中..."` (line 410) - Google registering
- ❌ `"Googleで登録"` (line 413) - Google register button
- ❌ `"既にアカウントをお持ちの方は"` (line 418) - Already have account

**建議結構:**
```json
{
  "auth": {
    "login": {
      "title": { "jp": "ログイン", "en": "Login", "cn": "登入" },
      "alreadyLoggedIn": { "jp": "ログイン済み", "en": "Already logged in", "cn": "已登入" },
      "welcome": { "jp": "ようこそ、{email}", "en": "Welcome, {email}", "cn": "歡迎，{email}" },
      "logout": { "jp": "ログアウト", "en": "Logout", "cn": "登出" },
      "email": { "jp": "Email", "en": "Email", "cn": "電子郵件" },
      "password": { "jp": "Password", "en": "Password", "cn": "密碼" },
      "loggingIn": { "jp": "ログイン中...", "en": "Logging in...", "cn": "登入中..." },
      "button": { "jp": "ログイン", "en": "Login", "cn": "登入" },
      "googleLogin": { "jp": "Googleでログイン", "en": "Login with Google", "cn": "使用 Google 登入" },
      "googleLoggingIn": { "jp": "Googleでログイン中...", "en": "Logging in with Google...", "cn": "使用 Google 登入中..." },
      "or": { "jp": "または", "en": "Or", "cn": "或" },
      "registerLink": { "jp": "新規登録は", "en": "New to us? ", "cn": "還沒有帳號？" },
      "registerLinkText": { "jp": "こちら", "en": "Register here", "cn": "點此註冊" },
      "errors": {
        "failed": { "jp": "ログインに失敗しました。メールアドレスとパスワードを確認してください。", "en": "Login failed. Please check your email and password.", "cn": "登入失敗。請檢查您的電子郵件和密碼。" },
        "unexpected": { "jp": "予期しないエラーが発生しました。もう一度お試しください。", "en": "An unexpected error occurred. Please try again.", "cn": "發生意外錯誤。請再試一次。" },
        "googleFailed": { "jp": "Googleログインに失敗しました。もう一度お試しください。", "en": "Google login failed. Please try again.", "cn": "Google 登入失敗。請再試一次。" }
      }
    },
    "register": {
      "title": { "jp": "新規登録", "en": "Register", "cn": "註冊" },
      "profileImage": { "jp": "プロフィール画像（任意）", "en": "Profile Image (Optional)", "cn": "個人資料圖片（選填）" },
      "uploading": { "jp": "アップロード中...", "en": "Uploading...", "cn": "上傳中..." },
      "lastName": { "jp": "氏", "en": "Last Name", "cn": "姓" },
      "firstName": { "jp": "名", "en": "First Name", "cn": "名" },
      "gender": { "jp": "性別", "en": "Gender", "cn": "性別" },
      "select": { "jp": "選択してください", "en": "Please select", "cn": "請選擇" },
      "male": { "jp": "男性", "en": "Male", "cn": "男性" },
      "female": { "jp": "女性", "en": "Female", "cn": "女性" },
      "other": { "jp": "その他", "en": "Other", "cn": "其他" },
      "address": { "jp": "住所", "en": "Address", "cn": "地址" },
      "postalCode": { "jp": "郵便番号（半角数字）", "en": "Postal Code (Half-width)", "cn": "郵遞區號（半形數字）" },
      "prefecture": { "jp": "都道府県", "en": "Prefecture", "cn": "都道府縣" },
      "city": { "jp": "市区町村", "en": "City", "cn": "市區" },
      "street": { "jp": "丁目・番地・号（数字は半角）", "en": "Street (Half-width numbers)", "cn": "街道（半形數字）" },
      "building": { "jp": "建物名／会社名（任意）", "en": "Building/Company (Optional)", "cn": "建築物/公司（選填）" },
      "room": { "jp": "部屋番号（任意）", "en": "Room Number (Optional)", "cn": "房間號碼（選填）" },
      "birthday": { "jp": "誕生日", "en": "Birthday", "cn": "生日" },
      "registering": { "jp": "登録中...", "en": "Registering...", "cn": "註冊中..." },
      "button": { "jp": "登録", "en": "Register", "cn": "註冊" },
      "googleRegister": { "jp": "Googleで登録", "en": "Register with Google", "cn": "使用 Google 註冊" },
      "googleRegistering": { "jp": "Googleで登録中...", "en": "Registering with Google...", "cn": "使用 Google 註冊中..." },
      "alreadyHaveAccount": { "jp": "既にアカウントをお持ちの方は", "en": "Already have an account? ", "cn": "已有帳號？" },
      "loginLinkText": { "jp": "こちら", "en": "Login here", "cn": "點此登入" },
      "errors": {
        "imageFile": { "jp": "画像ファイルを選択してください", "en": "Please select an image file", "cn": "請選擇圖片檔案" },
        "fileSize": { "jp": "ファイルサイズは5MB以下にしてください", "en": "File size must be 5MB or less", "cn": "檔案大小必須在 5MB 以下" },
        "uploadFailed": { "jp": "アップロードに失敗しました", "en": "Upload failed", "cn": "上傳失敗" },
        "lastNameRequired": { "jp": "姓を入力してください。", "en": "Please enter your last name.", "cn": "請輸入您的姓。" },
        "firstNameRequired": { "jp": "名を入力してください。", "en": "Please enter your first name.", "cn": "請輸入您的名。" },
        "postalCodeFormat": { "jp": "郵便番号は 123-4567 の形式（半角）で入力してください。", "en": "Please enter postal code in format 123-4567 (half-width).", "cn": "請以 123-4567 格式（半形）輸入郵遞區號。" },
        "prefectureRequired": { "jp": "都道府県を選択してください。", "en": "Please select a prefecture.", "cn": "請選擇都道府縣。" },
        "cityRequired": { "jp": "市区町村を入力してください。", "en": "Please enter city.", "cn": "請輸入市區。" },
        "streetRequired": { "jp": "丁目・番地・号を入力してください。", "en": "Please enter street address.", "cn": "請輸入街道地址。" },
        "streetNumberFormat": { "jp": "丁目・番地・号の数字は半角で入力してください。", "en": "Please enter street numbers in half-width.", "cn": "請以半形輸入街道號碼。" },
        "registrationFailed": { "jp": "登録に失敗しました", "en": "Registration failed", "cn": "註冊失敗" },
        "googleFailed": { "jp": "Google登録に失敗しました。もう一度お試しください。", "en": "Google registration failed. Please try again.", "cn": "Google 註冊失敗。請再試一次。" }
      }
    }
  }
}
```

---

## 4. My Page (個人頁面)

### `src/app/mypage/page.tsx`
- ❌ `"読み込み中..."` (line 31, 321) - Loading
- ❌ `"プロフィールの取得に失敗しました"` (line 111) - Profile fetch error
- ❌ `"注文履歴の取得に失敗しました"` (line 141) - Orders fetch error
- ❌ `"お気に入りの取得に失敗しました"` (line 155) - Likes fetch error
- ❌ `"レビューの取得に失敗しました"` (line 167) - Reviews fetch error
- ❌ `"このレビューを削除しますか？"` (line 206) - Delete confirmation
- ❌ `"削除に失敗しました"` (line 213) - Delete error
- ❌ `"画像ファイルを選択してください"` (line 230) - Image file error
- ❌ `"ファイルサイズは5MB以下にしてください"` (line 234) - File size error
- ❌ `"アップロードに失敗しました"` (line 248, 255) - Upload error
- ❌ `"画像をアップロードしました"` (line 252) - Upload success
- ❌ `"郵便番号は 123-4567 の形式（半角）で入力してください。"` (line 265) - Postal code format
- ❌ `"丁目・番地・号の数字は半角で入力してください。"` (line 269) - Street number format
- ❌ `"更新に失敗しました"` (line 280) - Update error
- ❌ `"プロフィールを更新しました"` (line 285) - Update success
- ❌ `"マイページ"` (line 359) - Page title
- ❌ `"ようこそ、{name}さん"` (line 361) - Welcome message
- ❌ `"プロフィール"` (line 384) - Profile tab
- ❌ `"カート ({count})"` (line 394) - Cart tab
- ❌ `"購入履歴 ({count})"` (line 404) - Orders tab
- ❌ `"お気に入り ({count})"` (line 414) - Likes tab
- ❌ `"レビュー ({count})"` (line 420) - Reviews tab
- ❌ `"プロフィール情報"` (line 430) - Profile info title
- ❌ `"編集"` (line 432) - Edit button
- ❌ `"プロフィール画像"` (line 449) - Profile image label
- ❌ `"アップロード中..."` (line 474) - Uploading
- ❌ `"姓"` (line 484) - Last name label
- ❌ `"名"` (line 497) - First name label
- ❌ `"性別"` (line 512) - Gender label
- ❌ `"誕生日"` (line 529) - Birthday label
- ❌ `"住所情報"` (line 542) - Address info title
- ❌ `"郵便番号（半角）"` (line 546) - Postal code label
- ❌ `"都道府県"` (line 559) - Prefecture label
- ❌ `"市区町村"` (line 578) - City label
- ❌ `"丁目・番地・号（半角）"` (line 591) - Street label
- ❌ `"建物名・会社名（任意）"` (line 604) - Building label
- ❌ `"部屋番号（任意）"` (line 617) - Room label
- ❌ `"保存"` (line 631) - Save button
- ❌ `"キャンセル"` (line 639) - Cancel button
- ❌ `"メールアドレス"` (line 663) - Email label
- ❌ `"氏名"` (line 668) - Name label
- ❌ `"未設定"` (line 674, 686, 696, 702) - Not set
- ❌ `"住所"` (line 700) - Address label
- ❌ `"ショッピングカート"` (line 713) - Shopping cart title
- ❌ `"カートは空です"` (line 717) - Cart empty
- ❌ `"商品を見る"` (line 719) - View products
- ❌ `"商品詳細"` (line 782) - Product details tooltip
- ❌ `"カートから削除"` (line 800) - Remove from cart tooltip
- ❌ `"合計:"` (line 811) - Total label
- ❌ `"カートを空にする"` (line 823) - Clear cart button
- ❌ `"購入手続きへ"` (line 826) - Proceed to checkout
- ❌ `"購入履歴"` (line 837) - Orders title
- ❌ `"購入履歴がありません"` (line 840) - No orders
- ❌ `"注文番号: #{id}"` (line 871) - Order number
- ❌ `"購入日: {date}"` (line 874) - Purchase date
- ❌ `"数量: {quantity}"` (line 882) - Quantity
- ❌ `"お気に入り"` (line 902) - Favorites title
- ❌ `"お気に入りがありません"` (line 905) - No favorites
- ❌ `"詳細を見る"` (line 944) - View details
- ❌ `"あなたのレビュー"` (line 959) - Your reviews title
- ❌ `"まだレビューはありません"` (line 962) - No reviews
- ❌ `"商品"` (line 981) - Product fallback
- ❌ `"商品ページへ"` (line 1006) - Go to product page
- ❌ `"削除"` (line 1000) - Delete button

**建議結構:**
```json
{
  "mypage": {
    "title": { "jp": "マイページ", "en": "My Page", "cn": "我的頁面" },
    "welcome": { "jp": "ようこそ、{name}さん", "en": "Welcome, {name}", "cn": "歡迎，{name}" },
    "tabs": {
      "profile": { "jp": "プロフィール", "en": "Profile", "cn": "個人資料" },
      "cart": { "jp": "カート ({count})", "en": "Cart ({count})", "cn": "購物車 ({count})" },
      "orders": { "jp": "購入履歴 ({count})", "en": "Orders ({count})", "cn": "訂單 ({count})" },
      "likes": { "jp": "お気に入り ({count})", "en": "Favorites ({count})", "cn": "收藏 ({count})" },
      "reviews": { "jp": "レビュー ({count})", "en": "Reviews ({count})", "cn": "評論 ({count})" }
    },
    "profile": {
      "title": { "jp": "プロフィール情報", "en": "Profile Information", "cn": "個人資料資訊" },
      "edit": { "jp": "編集", "en": "Edit", "cn": "編輯" },
      "save": { "jp": "保存", "en": "Save", "cn": "儲存" },
      "cancel": { "jp": "キャンセル", "en": "Cancel", "cn": "取消" },
      "notSet": { "jp": "未設定", "en": "Not Set", "cn": "未設定" }
    },
    "cart": {
      "title": { "jp": "ショッピングカート", "en": "Shopping Cart", "cn": "購物車" },
      "empty": { "jp": "カートは空です", "en": "Cart is empty", "cn": "購物車是空的" },
      "viewProducts": { "jp": "商品を見る", "en": "View Products", "cn": "查看商品" },
      "total": { "jp": "合計:", "en": "Total:", "cn": "總計：" },
      "clearCart": { "jp": "カートを空にする", "en": "Clear Cart", "cn": "清空購物車" },
      "proceedToCheckout": { "jp": "購入手続きへ", "en": "Proceed to Checkout", "cn": "前往結帳" }
    },
    "orders": {
      "title": { "jp": "購入履歴", "en": "Order History", "cn": "訂單歷史" },
      "empty": { "jp": "購入履歴がありません", "en": "No orders", "cn": "沒有訂單" },
      "orderNumber": { "jp": "注文番号: #{id}", "en": "Order Number: #{id}", "cn": "訂單編號：#{id}" },
      "purchaseDate": { "jp": "購入日: {date}", "en": "Purchase Date: {date}", "cn": "購買日期：{date}" },
      "quantity": { "jp": "数量: {quantity}", "en": "Quantity: {quantity}", "cn": "數量：{quantity}" }
    },
    "favorites": {
      "title": { "jp": "お気に入り", "en": "Favorites", "cn": "收藏" },
      "empty": { "jp": "お気に入りがありません", "en": "No favorites", "cn": "沒有收藏" },
      "viewDetails": { "jp": "詳細を見る", "en": "View Details", "cn": "查看詳情" }
    },
    "reviews": {
      "title": { "jp": "あなたのレビュー", "en": "Your Reviews", "cn": "您的評論" },
      "empty": { "jp": "まだレビューはありません", "en": "No reviews yet", "cn": "還沒有評論" },
      "productFallback": { "jp": "商品", "en": "Product", "cn": "商品" },
      "goToProduct": { "jp": "商品ページへ", "en": "Go to Product Page", "cn": "前往商品頁面" },
      "delete": { "jp": "削除", "en": "Delete", "cn": "刪除" },
      "deleteConfirm": { "jp": "このレビューを削除しますか？", "en": "Delete this review?", "cn": "刪除此評論？" }
    }
  }
}
```

---

## 5. Cart (購物車)

### `src/components/common/CartSheet.tsx`
- ❌ `"カート"` (line 47) - Cart tooltip
- ❌ `"ショッピングカート"` (line 54) - Shopping cart title
- ❌ `"カートは空です"` (line 61) - Cart empty
- ❌ `"商品を見る"` (line 63) - View products
- ❌ `"数量"` (line 99) - Quantity label
- ❌ `"削除"` (line 109) - Delete option
- ❌ `"カートを空にする"` (line 127) - Clear cart
- ❌ `"合計:"` (line 133) - Total label
- ❌ `"買い物を続ける"` (line 142) - Continue shopping
- ❌ `"レジに進む"` (line 147) - Proceed to checkout

### `src/app/checkout/page.tsx`
- ❌ `"カートが空です"` (line 65) - Cart empty alert
- ❌ `"必須項目を入力してください"` (line 76) - Required fields
- ❌ `"チェックアウトセッションの作成に失敗しました"` (line 101) - Checkout session error
- ❌ `"チェックアウト URL が取得できませんでした"` (line 110) - Checkout URL error
- ❌ `"注文に失敗しました"` (line 113) - Order failed
- ❌ `"チェックアウト"` (line 122) - Checkout title
- ❌ `"カートは空です"` (line 124) - Cart empty message
- ❌ `"商品を見る"` (line 126) - View products
- ❌ `"注文内容"` (line 141) - Order summary
- ❌ `"数量: {quantity}"` (line 160) - Quantity
- ❌ `"合計:"` (line 172) - Total
- ❌ `"お客様情報"` (line 181) - Customer information
- ❌ `"💳 安全な決済について"` (line 185) - Secure payment title
- ❌ `"お支払いは Stripe の安全な決済システムを使用しています。\nクレジットカード情報は当社では保存されません。"` (line 188) - Payment security message
- ❌ `"特定商取引法に基づく表記"` (line 199) - Legal notice link
- ❌ `"をご確認ください。"` (line 201) - Please check
- ❌ `"氏 *"` (line 209) - Last name required
- ❌ `"名 *"` (line 224) - First name required
- ❌ `"メールアドレス *"` (line 240) - Email required
- ❌ `"配送先住所 *"` (line 255) - Shipping address required
- ❌ `"支払い方法 *"` (line 269) - Payment method required
- ❌ `"クレジットカード"` (line 278) - Credit card option
- ❌ `"カートに戻る"` (line 285) - Back to cart
- ❌ `"処理中..."` (line 294) - Processing
- ❌ `"注文を確定する"` (line 294) - Confirm order

**建議結構:**
```json
{
  "cart": {
    "tooltip": { "jp": "カート", "en": "Cart", "cn": "購物車" },
    "title": { "jp": "ショッピングカート", "en": "Shopping Cart", "cn": "購物車" },
    "empty": { "jp": "カートは空です", "en": "Cart is empty", "cn": "購物車是空的" },
    "viewProducts": { "jp": "商品を見る", "en": "View Products", "cn": "查看商品" },
    "quantity": { "jp": "数量", "en": "Quantity", "cn": "數量" },
    "delete": { "jp": "削除", "en": "Delete", "cn": "刪除" },
    "clearCart": { "jp": "カートを空にする", "en": "Clear Cart", "cn": "清空購物車" },
    "total": { "jp": "合計:", "en": "Total:", "cn": "總計：" },
    "continueShopping": { "jp": "買い物を続ける", "en": "Continue Shopping", "cn": "繼續購物" },
    "proceedToCheckout": { "jp": "レジに進む", "en": "Proceed to Checkout", "cn": "前往結帳" }
  },
  "checkout": {
    "title": { "jp": "チェックアウト", "en": "Checkout", "cn": "結帳" },
    "orderSummary": { "jp": "注文内容", "en": "Order Summary", "cn": "訂單摘要" },
    "customerInfo": { "jp": "お客様情報", "en": "Customer Information", "cn": "客戶資訊" },
    "securePayment": {
      "title": { "jp": "💳 安全な決済について", "en": "💳 Secure Payment", "cn": "💳 安全付款" },
      "message": { "jp": "お支払いは Stripe の安全な決済システムを使用しています。\nクレジットカード情報は当社では保存されません。", "en": "We use Stripe's secure payment system.\nCredit card information is not stored by us.", "cn": "我們使用 Stripe 的安全付款系統。\n我們不會儲存信用卡資訊。" },
      "legalNotice": { "jp": "特定商取引法に基づく表記", "en": "Legal Notice", "cn": "法律聲明" },
      "pleaseCheck": { "jp": "をご確認ください。", "en": "Please check.", "cn": "請查看。" }
    },
    "form": {
      "lastName": { "jp": "氏 *", "en": "Last Name *", "cn": "姓 *" },
      "firstName": { "jp": "名 *", "en": "First Name *", "cn": "名 *" },
      "email": { "jp": "メールアドレス *", "en": "Email *", "cn": "電子郵件 *" },
      "address": { "jp": "配送先住所 *", "en": "Shipping Address *", "cn": "配送地址 *" },
      "paymentMethod": { "jp": "支払い方法 *", "en": "Payment Method *", "cn": "付款方式 *" },
      "creditCard": { "jp": "クレジットカード", "en": "Credit Card", "cn": "信用卡" }
    },
    "buttons": {
      "backToCart": { "jp": "カートに戻る", "en": "Back to Cart", "cn": "返回購物車" },
      "processing": { "jp": "処理中...", "en": "Processing...", "cn": "處理中..." },
      "confirmOrder": { "jp": "注文を確定する", "en": "Confirm Order", "cn": "確認訂單" }
    },
    "errors": {
      "cartEmpty": { "jp": "カートが空です", "en": "Cart is empty", "cn": "購物車是空的" },
      "requiredFields": { "jp": "必須項目を入力してください", "en": "Please fill in required fields", "cn": "請填寫必填欄位" },
      "sessionFailed": { "jp": "チェックアウトセッションの作成に失敗しました", "en": "Failed to create checkout session", "cn": "建立結帳會話失敗" },
      "urlFailed": { "jp": "チェックアウト URL が取得できませんでした", "en": "Failed to get checkout URL", "cn": "無法取得結帳網址" },
      "orderFailed": { "jp": "注文に失敗しました", "en": "Order failed", "cn": "訂單失敗" }
    }
  }
}
```

---

## 6. Products (商品)

### `src/app/products/components/layout/Header.tsx`
- ❌ `"商品一覧"` (line 8) - Products list

### `src/components/layout/app-sidebar.tsx`
- ❌ `"商品一覧"` (line 56, 60) - Products list

### `src/app/(index)/components/layout/sales.tsx`
- ❌ `"税込"` (line 84) - Tax included

### `src/app/products/[id]/components/common/AddToCartButton.tsx`
- ❌ `"追加しました！"` (line 70) - Added successfully
- ❌ `"カートに追加中..."` (line 70) - Adding to cart

**建議結構:**
```json
{
  "products": {
    "list": { "jp": "商品一覧", "en": "Products", "cn": "商品列表" },
    "taxIncluded": { "jp": "税込", "en": "Tax included", "cn": "含稅" },
    "addToCart": {
      "adding": { "jp": "カートに追加中...", "en": "Adding to cart...", "cn": "加入購物車中..." },
      "success": { "jp": "追加しました！", "en": "Added!", "cn": "已加入！" }
    }
  }
}
```

---

## 7. Comments/Reviews (評論)

### `src/components/common/commentInput.tsx`
- ❌ `"コメントを入力してください"` (line 35) - Comment required
- ❌ `"購入履歴がありません"` (line 49) - No purchase history
- ❌ `"投稿に失敗しました"` (line 54, 64) - Post failed
- ❌ `"AI リライトの前にコメントを入力してください。"` (line 72) - Comment required for AI
- ❌ `"AI リライトに失敗しました。"` (line 90, 98) - AI rewrite failed
- ❌ `"レビューを投稿するにはログインしてください。"` (line 108) - Login required
- ❌ `"ログイン"` (line 111) - Login button
- ❌ `"{name} としてレビューを投稿します"` (line 128) - Posting as user
- ❌ `"評価"` (line 134) - Rating label
- ❌ `"コメント"` (line 173) - Comment label
- ❌ `"商品の感想やおすすめポイントを書いてください"` (line 179) - Comment placeholder
- ❌ `"AI がコメントを自然な日本語に整えます"` (line 205) - AI tooltip
- ❌ `"投稿中..."` (line 211) - Posting
- ❌ `"レビューを投稿"` (line 215) - Post review button

**建議結構:**
```json
{
  "comments": {
    "rating": { "jp": "評価", "en": "Rating", "cn": "評分" },
    "comment": { "jp": "コメント", "en": "Comment", "cn": "評論" },
    "placeholder": { "jp": "商品の感想やおすすめポイントを書いてください", "en": "Share your thoughts and recommendations", "cn": "分享您的想法和推薦" },
    "postingAs": { "jp": "{name} としてレビューを投稿します", "en": "Posting review as {name}", "cn": "以 {name} 的身份發表評論" },
    "posting": { "jp": "投稿中...", "en": "Posting...", "cn": "發表中..." },
    "postButton": { "jp": "レビューを投稿", "en": "Post Review", "cn": "發表評論" },
    "aiTooltip": { "jp": "AI がコメントを自然な日本語に整えます", "en": "AI will polish your comment into natural Japanese", "cn": "AI 會將您的評論整理成自然的日語" },
    "loginRequired": { "jp": "レビューを投稿するにはログインしてください。", "en": "Please login to post a review.", "cn": "請登入以發表評論。" },
    "errors": {
      "commentRequired": { "jp": "コメントを入力してください", "en": "Please enter a comment", "cn": "請輸入評論" },
      "noPurchaseHistory": { "jp": "購入履歴がありません", "en": "No purchase history", "cn": "沒有購買記錄" },
      "postFailed": { "jp": "投稿に失敗しました", "en": "Failed to post", "cn": "發表失敗" },
      "aiCommentRequired": { "jp": "AI リライトの前にコメントを入力してください。", "en": "Please enter a comment before AI rewrite.", "cn": "在 AI 重寫之前請輸入評論。" },
      "aiRewriteFailed": { "jp": "AI リライトに失敗しました。", "en": "AI rewrite failed.", "cn": "AI 重寫失敗。" }
    }
  }
}
```

---

## 8. Dashboard (管理後台)

### `src/app/dashboard/page.tsx`
- ❌ `"読み込み中..."` (line 142) - Loading
- ❌ `"商品管理ダッシュボード"` (line 148) - Dashboard title
- ❌ `"注文管理"` (line 155) - Order management
- ❌ `"会員管理"` (line 158) - Member management
- ❌ `"新しい商品を追加"` (line 165) - Add new product
- ❌ `"商品を編集"` (line 174) - Edit product
- ❌ `"新しい商品を追加"` (line 174) - Add new product
- ❌ `"英語名"` (line 186) - English name
- ❌ `"日本語名"` (line 198) - Japanese name
- ❌ `"中国語名"` (line 210) - Chinese name
- ❌ `"カテゴリー"` (line 222) - Category
- ❌ `"ブランド"` (line 234) - Brand
- ❌ `"在庫数"` (line 246) - Stock
- ❌ `"価格 (円)"` (line 251) - Price
- ❌ `"画像URL"` (line 276) - Image URL
- ❌ `"英語説明"` (line 288) - English description
- ❌ `"日本語説明"` (line 299) - Japanese description
- ❌ `"中国語説明"` (line 310) - Chinese description
- ❌ `"更新"` (line 325) - Update button
- ❌ `"追加"` (line 325) - Add button
- ❌ `"本当に削除しますか？"` (line 108) - Delete confirmation
- ❌ `"お気に入り ({count})"` (line 379) - Likes count
- ❌ `"商品がありません"` (line 410) - No products

**建議結構:**
```json
{
  "dashboard": {
    "title": { "jp": "商品管理ダッシュボード", "en": "Product Management Dashboard", "cn": "商品管理儀表板" },
    "loading": { "jp": "読み込み中...", "en": "Loading...", "cn": "載入中..." },
    "buttons": {
      "orderManagement": { "jp": "注文管理", "en": "Order Management", "cn": "訂單管理" },
      "memberManagement": { "jp": "会員管理", "en": "Member Management", "cn": "會員管理" },
      "addProduct": { "jp": "新しい商品を追加", "en": "Add New Product", "cn": "新增商品" },
      "editProduct": { "jp": "商品を編集", "en": "Edit Product", "cn": "編輯商品" },
      "update": { "jp": "更新", "en": "Update", "cn": "更新" },
      "add": { "jp": "追加", "en": "Add", "cn": "新增" }
    },
    "form": {
      "nameEn": { "jp": "英語名", "en": "English Name", "cn": "英文名稱" },
      "nameJp": { "jp": "日本語名", "en": "Japanese Name", "cn": "日文名稱" },
      "nameCn": { "jp": "中国語名", "en": "Chinese Name", "cn": "中文名稱" },
      "category": { "jp": "カテゴリー", "en": "Category", "cn": "分類" },
      "brand": { "jp": "ブランド", "en": "Brand", "cn": "品牌" },
      "stock": { "jp": "在庫数", "en": "Stock", "cn": "庫存" },
      "price": { "jp": "価格 (円)", "en": "Price (Yen)", "cn": "價格（日圓）" },
      "imageUrl": { "jp": "画像URL", "en": "Image URL", "cn": "圖片網址" },
      "descriptionEn": { "jp": "英語説明", "en": "English Description", "cn": "英文說明" },
      "descriptionJp": { "jp": "日本語説明", "en": "Japanese Description", "cn": "日文說明" },
      "descriptionCn": { "jp": "中国語説明", "en": "Chinese Description", "cn": "中文說明" }
    },
    "messages": {
      "deleteConfirm": { "jp": "本当に削除しますか？", "en": "Are you sure you want to delete?", "cn": "確定要刪除嗎？" },
      "noProducts": { "jp": "商品がありません", "en": "No products", "cn": "沒有商品" },
      "likesCount": { "jp": "お気に入り ({count})", "en": "Likes ({count})", "cn": "收藏 ({count})" }
    }
  }
}
```

---

## 9. AI Chat (AI 聊天)

### `src/app/ai/page.tsx`
- ❌ `"件の商品が見つかりました"` (line 130) - Products found
- ❌ `"該当する商品が見つかりませんでした"` (line 156) - No products found
- ❌ `"商品を検索中..."` (line 164) - Searching products
- ❌ `"商品詳細情報"` (line 238) - Product details
- ❌ `"商品詳細を取得中..."` (line 279) - Fetching product details
- ❌ `"画像生成に失敗しました：画像 URL が取得できませんでした"` (line 81) - Image generation failed
- ❌ `"画像が生成されました！"` (line 93) - Image generated

**建議結構:**
```json
{
  "ai": {
    "search": {
      "found": { "jp": "{count}件の商品が見つかりました", "en": "Found {count} products", "cn": "找到 {count} 件商品" },
      "notFound": { "jp": "該当する商品が見つかりませんでした", "en": "No products found", "cn": "找不到相關商品" },
      "searching": { "jp": "商品を検索中...", "en": "Searching products...", "cn": "搜尋商品中..." }
    },
    "product": {
      "details": { "jp": "商品詳細情報", "en": "Product Details", "cn": "商品詳情" },
      "fetching": { "jp": "商品詳細を取得中...", "en": "Fetching product details...", "cn": "取得商品詳情中..." }
    },
    "image": {
      "generated": { "jp": "画像が生成されました！", "en": "Image generated!", "cn": "圖片已生成！" },
      "failed": { "jp": "画像生成に失敗しました：画像 URL が取得できませんでした", "en": "Image generation failed: Could not get image URL", "cn": "圖片生成失敗：無法取得圖片網址" }
    }
  }
}
```

---

## 10. Legal Pages (法律頁面)

### `src/app/legal/tokusho/page.tsx`
- ❌ `"特定商取引法に基づく表記"` (line 6) - Page title
- ❌ `"販売業者名"` (line 11) - Seller name
- ❌ `"運営責任者名"` (line 18) - Operator name
- ❌ `"所在地"` (line 24) - Address
- ❌ `"連絡先"` (line 33) - Contact
- ❌ `"電話番号:"` (line 36) - Phone number
- ❌ `"受付時間:"` (line 39) - Reception hours
- ❌ `"メールアドレス:"` (line 44) - Email
- ❌ `"販売価格"` (line 51) - Selling price
- ❌ `"各商品ページに記載の価格（消費税込み）"` (line 54) - Price description
- ❌ `"商品代金以外の必要料金"` (line 60) - Additional fees
- ❌ `"送料:"` (line 64) - Shipping fee
- ❌ `"全国一律500円（5,000円以上のご購入で送料無料）"` (line 65) - Shipping fee description
- ❌ `"手数料:"` (line 68) - Handling fee
- ❌ `"クレジットカード決済手数料はお客様のご負担となります"` (line 69) - Handling fee description
- ❌ `"消費税:"` (line 72) - Consumption tax
- ❌ `"商品価格に含まれています"` (line 72) - Tax included
- ❌ `"支払方法および支払時期"` (line 79) - Payment method and timing
- ❌ `"支払方法:"` (line 83) - Payment method
- ❌ `"クレジットカード決済（Visa、MasterCard、American Express、JCB）"` (line 84) - Payment method description
- ❌ `"支払時期:"` (line 87) - Payment timing
- ❌ `"ご注文時にお支払いが確定します"` (line 87) - Payment timing description
- ❌ `"商品の引渡時期"` (line 94) - Delivery timing
- ❌ `"ご注文確認後、3営業日以内に発送いたします。\n（在庫状況により、発送が遅れる場合がございます。その場合は事前にご連絡いたします）"` (line 97) - Delivery timing description
- ❌ `"返品・キャンセルについて"` (line 105) - Returns and cancellations
- ❌ `"返品・交換について"` (line 109) - Returns and exchanges
- ❌ `"商品到着後7日以内に限り、未使用・未開封の商品に限り返品・交換を受け付けます。\n返品・交換をご希望の場合は、事前にメールまたはお電話でご連絡ください。"` (line 111) - Returns description
- ❌ `"返品送料"` (line 117) - Return shipping
- ❌ `"お客様都合による返品の場合、返品送料はお客様のご負担となります。\n不良品・誤配送の場合は、当社が負担いたします。"` (line 119) - Return shipping description
- ❌ `"キャンセルについて"` (line 125) - Cancellation
- ❌ `"ご注文確定後、商品発送前であればキャンセル可能です。\n商品発送後のキャンセルはお受けできません。返品手続きをご利用ください。"` (line 127) - Cancellation description
- ❌ `"返金について"` (line 133) - Refund
- ❌ `"返品が確認され次第、7営業日以内にご指定の口座へ返金いたします。\n返金手数料は当社が負担いたします。"` (line 135) - Refund description
- ❌ `"その他"` (line 144) - Other
- ❌ `"本サイトは、Stripe の安全な決済システムを使用しています。\nクレジットカード情報は当社では保存されません。"` (line 147) - Other description
- ❌ `"ご不明な点がございましたら、お気軽にお問い合わせください。"` (line 151) - Contact message
- ❌ `"最終更新日: 2025年1月"` (line 157) - Last updated

**建議結構:**
```json
{
  "legal": {
    "tokusho": {
      "title": { "jp": "特定商取引法に基づく表記", "en": "Legal Notice", "cn": "法律聲明" },
      "seller": { "jp": "販売業者名", "en": "Seller Name", "cn": "賣方名稱" },
      "operator": { "jp": "運営責任者名", "en": "Operator Name", "cn": "營運負責人" },
      "address": { "jp": "所在地", "en": "Address", "cn": "地址" },
      "contact": { "jp": "連絡先", "en": "Contact", "cn": "聯絡方式" },
      "phone": { "jp": "電話番号:", "en": "Phone Number:", "cn": "電話號碼：" },
      "receptionHours": { "jp": "受付時間:", "en": "Reception Hours:", "cn": "服務時間：" },
      "email": { "jp": "メールアドレス:", "en": "Email:", "cn": "電子郵件：" },
      "sellingPrice": { "jp": "販売価格", "en": "Selling Price", "cn": "售價" },
      "priceDescription": { "jp": "各商品ページに記載の価格（消費税込み）", "en": "Prices listed on each product page (tax included)", "cn": "各商品頁面標示的價格（含稅）" },
      "additionalFees": { "jp": "商品代金以外の必要料金", "en": "Additional Fees", "cn": "額外費用" },
      "shippingFee": { "jp": "送料:", "en": "Shipping Fee:", "cn": "運費：" },
      "shippingDescription": { "jp": "全国一律500円（5,000円以上のご購入で送料無料）", "en": "500 yen nationwide (free shipping for purchases over 5,000 yen)", "cn": "全國統一 500 日圓（購買 5,000 日圓以上免運費）" },
      "handlingFee": { "jp": "手数料:", "en": "Handling Fee:", "cn": "手續費：" },
      "handlingDescription": { "jp": "クレジットカード決済手数料はお客様のご負担となります", "en": "Credit card payment fees are borne by the customer", "cn": "信用卡付款手續費由客戶負擔" },
      "tax": { "jp": "消費税:", "en": "Consumption Tax:", "cn": "消費稅：" },
      "taxIncluded": { "jp": "商品価格に含まれています", "en": "Included in product price", "cn": "已包含在商品價格中" },
      "payment": { "jp": "支払方法および支払時期", "en": "Payment Method and Timing", "cn": "付款方式與時間" },
      "paymentMethod": { "jp": "支払方法:", "en": "Payment Method:", "cn": "付款方式：" },
      "paymentDescription": { "jp": "クレジットカード決済（Visa、MasterCard、American Express、JCB）", "en": "Credit card payment (Visa, MasterCard, American Express, JCB)", "cn": "信用卡付款（Visa、MasterCard、American Express、JCB）" },
      "paymentTiming": { "jp": "支払時期:", "en": "Payment Timing:", "cn": "付款時間：" },
      "paymentTimingDescription": { "jp": "ご注文時にお支払いが確定します", "en": "Payment is confirmed at the time of order", "cn": "訂單時確認付款" },
      "delivery": { "jp": "商品の引渡時期", "en": "Delivery Timing", "cn": "交貨時間" },
      "deliveryDescription": { "jp": "ご注文確認後、3営業日以内に発送いたします。\n（在庫状況により、発送が遅れる場合がございます。その場合は事前にご連絡いたします）", "en": "We will ship within 3 business days after order confirmation.\n(Delivery may be delayed depending on stock status. We will contact you in advance in such cases)", "cn": "訂單確認後，將在 3 個工作天內發貨。\n（根據庫存狀況，發貨可能會延遲。此情況下我們會事先通知您）" },
      "returns": { "jp": "返品・キャンセルについて", "en": "Returns and Cancellations", "cn": "退貨與取消" },
      "returnsTitle": { "jp": "返品・交換について", "en": "Returns and Exchanges", "cn": "退貨與換貨" },
      "returnsDescription": { "jp": "商品到着後7日以内に限り、未使用・未開封の商品に限り返品・交換を受け付けます。\n返品・交換をご希望の場合は、事前にメールまたはお電話でご連絡ください。", "en": "Returns and exchanges are accepted only within 7 days of product arrival and only for unused, unopened products.\nIf you wish to return or exchange, please contact us by email or phone in advance.", "cn": "僅接受商品到貨後 7 天內，且僅限未使用、未開封的商品退換貨。\n如需退換貨，請事先透過電子郵件或電話聯絡我們。" },
      "returnShipping": { "jp": "返品送料", "en": "Return Shipping", "cn": "退貨運費" },
      "returnShippingDescription": { "jp": "お客様都合による返品の場合、返品送料はお客様のご負担となります。\n不良品・誤配送の場合は、当社が負担いたします。", "en": "For returns due to customer circumstances, return shipping is borne by the customer.\nFor defective products or misdelivery, we will bear the cost.", "cn": "因客戶原因退貨時，退貨運費由客戶負擔。\n如有瑕疵品或誤送，我們將負擔費用。" },
      "cancellation": { "jp": "キャンセルについて", "en": "Cancellation", "cn": "取消" },
      "cancellationDescription": { "jp": "ご注文確定後、商品発送前であればキャンセル可能です。\n商品発送後のキャンセルはお受けできません。返品手続きをご利用ください。", "en": "Cancellation is possible after order confirmation and before product shipment.\nCancellation after product shipment is not accepted. Please use the return procedure.", "cn": "訂單確認後、商品發貨前可取消。\n商品發貨後無法取消。請使用退貨程序。" },
      "refund": { "jp": "返金について", "en": "Refund", "cn": "退款" },
      "refundDescription": { "jp": "返品が確認され次第、7営業日以内にご指定の口座へ返金いたします。\n返金手数料は当社が負担いたします。", "en": "We will refund to your designated account within 7 business days after return confirmation.\nRefund fees will be borne by us.", "cn": "退貨確認後，將在 7 個工作天內退款至您指定的帳戶。\n退款手續費由我們負擔。" },
      "other": { "jp": "その他", "en": "Other", "cn": "其他" },
      "otherDescription": { "jp": "本サイトは、Stripe の安全な決済システムを使用しています。\nクレジットカード情報は当社では保存されません。", "en": "This site uses Stripe's secure payment system.\nCredit card information is not stored by us.", "cn": "本網站使用 Stripe 的安全付款系統。\n我們不會儲存信用卡資訊。" },
      "contactMessage": { "jp": "ご不明な点がございましたら、お気軽にお問い合わせください。", "en": "If you have any questions, please feel free to contact us.", "cn": "如有任何疑問，歡迎隨時聯絡我們。" },
      "lastUpdated": { "jp": "最終更新日: 2025年1月", "en": "Last Updated: January 2025", "cn": "最後更新：2025 年 1 月" }
    }
  }
}
```

---

## 11. Common UI Elements (通用 UI 元素)

### `src/components/common/Grid.tsx`
- ❌ `"商品カテゴリー"` (line 17) - Product category
- ❌ `"商品画像"` (line 21) - Product image
- ❌ `"商品情報"` (line 39) - Product information

### `src/app/products/loading.tsx`
- ❌ `"商品圖片 skeleton"` (line 19) - Product image skeleton (comment)
- ❌ `"商品資訊 skeleton"` (line 24) - Product info skeleton (comment)

**建議結構:**
```json
{
  "common": {
    "product": {
      "category": { "jp": "商品カテゴリー", "en": "Product Category", "cn": "商品分類" },
      "image": { "jp": "商品画像", "en": "Product Image", "cn": "商品圖片" },
      "information": { "jp": "商品情報", "en": "Product Information", "cn": "商品資訊" }
    }
  }
}
```

---

## 12. Footer (頁尾)

### `src/components/layout/footer.tsx`
- ❌ `"商品を探す"` (line 35) - Find products

**建議結構:**
```json
{
  "footer": {
    "findProducts": { "jp": "商品を探す", "en": "Find Products", "cn": "尋找商品" }
  }
}
```

---

## 13. Checkout Success (結帳成功)

### `src/app/checkout/success/page.tsx`
- ❌ `"セッション ID が見つかりません"` (line 37) - Session ID not found
- ❌ `"商品を見る"` (line 99) - View products
- ❌ `"数量: {quantity}"` (line 142) - Quantity

**建議結構:**
```json
{
  "checkoutSuccess": {
    "sessionNotFound": { "jp": "セッション ID が見つかりません", "en": "Session ID not found", "cn": "找不到會話 ID" },
    "viewProducts": { "jp": "商品を見る", "en": "View Products", "cn": "查看商品" },
    "quantity": { "jp": "数量: {quantity}", "en": "Quantity: {quantity}", "cn": "數量：{quantity}" }
  }
}
```

---

## 14. Members Management (會員管理)

### `src/app/members/page.tsx`
- ❌ `"商品管理"` (line 76) - Product management
- ❌ `"お気に入り ({count})"` (line 152) - Likes count

### `src/app/members/[id]/orders/page.tsx`
- ❌ `"数量: {quantity}"` (line 48) - Quantity
- ❌ `"商品ページへ"` (line 51) - Go to product page

### `src/app/members/[id]/likes/page.tsx`
- ❌ `"会員のお気に入り"` (line 28) - Member favorites
- ❌ `"お気に入りがありません。"` (line 37) - No favorites
- ❌ `"商品ページへ"` (line 50) - Go to product page

### `src/app/members/[id]/comments/page.tsx`
- (需要檢查檔案內容)

**建議結構:**
```json
{
  "members": {
    "productManagement": { "jp": "商品管理", "en": "Product Management", "cn": "商品管理" },
    "likesCount": { "jp": "お気に入り ({count})", "en": "Likes ({count})", "cn": "收藏 ({count})" },
    "favorites": {
      "title": { "jp": "会員のお気に入り", "en": "Member Favorites", "cn": "會員收藏" },
      "empty": { "jp": "お気に入りがありません。", "en": "No favorites.", "cn": "沒有收藏。" }
    },
    "orders": {
      "quantity": { "jp": "数量: {quantity}", "en": "Quantity: {quantity}", "cn": "數量：{quantity}" },
      "goToProduct": { "jp": "商品ページへ", "en": "Go to Product Page", "cn": "前往商品頁面" }
    }
  }
}
```

---

## 15. Dashboard Product Details (管理後台商品詳情)

### `src/app/dashboard/products/[id]/orders/page.tsx`
- ❌ `"商品注文の詳細"` (line 29) - Product order details
- ❌ `"← 商品一覧へ戻る"` (line 34) - Back to products list
- ❌ `"数量: {quantity}"` (line 51) - Quantity

### `src/app/dashboard/products/[id]/likes/page.tsx`
- ❌ `"商品のお気に入り"` (line 27) - Product favorites
- ❌ `"← 商品一覧へ戻る"` (line 32) - Back to products list
- ❌ `"お気に入りがありません。"` (line 36) - No favorites

### `src/app/dashboard/products/[id]/comments/page.tsx`
- ❌ `"商品のレビュー"` (line 33) - Product reviews
- ❌ `"← 商品一覧へ戻る"` (line 39) - Back to products list

**建議結構:**
```json
{
  "dashboardProducts": {
    "orders": {
      "title": { "jp": "商品注文の詳細", "en": "Product Order Details", "cn": "商品訂單詳情" },
      "backToList": { "jp": "← 商品一覧へ戻る", "en": "← Back to Products List", "cn": "← 返回商品列表" },
      "quantity": { "jp": "数量: {quantity}", "en": "Quantity: {quantity}", "cn": "數量：{quantity}" }
    },
    "likes": {
      "title": { "jp": "商品のお気に入り", "en": "Product Favorites", "cn": "商品收藏" },
      "empty": { "jp": "お気に入りがありません。", "en": "No favorites.", "cn": "沒有收藏。" }
    },
    "comments": {
      "title": { "jp": "商品のレビュー", "en": "Product Reviews", "cn": "商品評論" }
    }
  }
}
```

---

## 總結

### 統計
- **總檔案數**: 約 50+ 個檔案包含 hard-coded 文字
- **總字串數**: 約 300+ 個需要翻譯的字串
- **主要分類**:
  1. Navigation (導覽) - 3 個
  2. Search (搜尋) - 5 個
  3. Authentication (認證) - 60+ 個
  4. My Page (個人頁面) - 80+ 個
  5. Cart (購物車) - 20+ 個
  6. Products (商品) - 5 個
  7. Comments (評論) - 15 個
  8. Dashboard (管理後台) - 25 個
  9. AI Chat (AI 聊天) - 7 個
  10. Legal (法律頁面) - 40+ 個
  11. Common UI (通用 UI) - 3 個
  12. Footer (頁尾) - 1 個
  13. Checkout Success (結帳成功) - 3 個
  14. Members (會員管理) - 5 個
  15. Dashboard Products (管理後台商品) - 6 個

### 下一步行動
1. ✅ 建立此 todo 清單
2. ⬜ 擴充 `content.json` 結構以包含所有上述字串
3. ⬜ 安裝並設定 next-intl
4. ⬜ 逐步將 hard-coded 文字替換為 next-intl 的 `useTranslations()` hook
5. ⬜ 測試所有頁面的多語言切換功能
6. ⬜ 確保所有動態內容（如數量、日期等）正確格式化

### 注意事項
- 某些字串包含動態變數（如 `{name}`, `{count}`, `{quantity}`），需要確保 next-intl 的正確格式化
- 日期格式需要根據語言進行本地化
- 數字格式（價格、數量）需要根據語言進行格式化
- 某些錯誤訊息可能需要更詳細的結構化處理

