# Windows シンボリックリンク権限エラー修正ガイド

## エラー内容
```
Error: EPERM: operation not permitted, symlink '..\..\..\_not-found.func' -> 'C:\Users\doubl\Desktop\My\Web\Next.JS\bushigear\.vercel\output\functions\dashboard\products\[id]\likes.func'
```

このエラーは、Windows で Vercel ビルド時にシンボリックリンクを作成する権限がない場合に発生します。

## 解決方法

### 方法 1: Windows 開発者モードを有効化（推奨）

1. **Windows 設定を開く**
   - `Win + I` キーを押す
   - または、スタートメニューから「設定」を検索

2. **開発者向け設定に移動**
   - 「プライバシーとセキュリティ」をクリック
   - 「開発者向け」をクリック

3. **開発者モードを有効化**
   - 「開発者モード」のトグルをオンにする
   - 再起動を求められた場合は、再起動してください

### 方法 2: PowerShell スクリプトを使用

プロジェクトルートで以下のコマンドを実行：

```powershell
.\fix-symlink-permission.ps1
```

### 方法 3: 管理者権限で実行

1. PowerShell を管理者として開く
   - スタートメニューで「PowerShell」を検索
   - 右クリックして「管理者として実行」を選択

2. プロジェクトディレクトリに移動してビルド：

```powershell
cd "C:\Users\doubl\Desktop\My\Web\Next.JS\bushigear"
pnpm build
```

### 方法 4: .vercel ディレクトリをクリーンアップ

既存の `.vercel` ディレクトリを削除してから再ビルド：

```powershell
Remove-Item -Recurse -Force .vercel
pnpm build
```

## 確認方法

開発者モードが有効になっているか確認：

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense"
```

`AllowDevelopmentWithoutDevLicense` が `1` になっていれば有効です。

## 注意事項

- 開発者モードを有効にすると、システムのセキュリティ設定が緩和されます
- 開発環境でのみ使用することを推奨します
- 本番環境（Vercel）ではこの問題は発生しません（Linux ベースのため）

