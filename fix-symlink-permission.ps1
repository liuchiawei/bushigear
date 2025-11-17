# Fix symlink permission error on Windows
# This script helps resolve EPERM errors when building with Vercel

Write-Host "Fixing symlink permission error..." -ForegroundColor Yellow

# Check Developer Mode status
$developerMode = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue

if ($developerMode -and $developerMode.AllowDevelopmentWithoutDevLicense -eq 1) {
    Write-Host "Developer Mode is already enabled" -ForegroundColor Green
} else {
    Write-Host "Developer Mode needs to be enabled manually:" -ForegroundColor Yellow
    Write-Host "1. Open Windows Settings (Win + I)" -ForegroundColor White
    Write-Host "2. Go to Privacy & Security > For developers" -ForegroundColor White
    Write-Host "3. Turn on 'Developer Mode'" -ForegroundColor White
}

# Clean up .vercel directory
if (Test-Path .vercel) {
    Write-Host "`nCleaning up .vercel directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue
    Write-Host ".vercel directory removed" -ForegroundColor Green
}

# Optionally clean .next directory
Write-Host "`nClean .next directory too? (y/n): " -ForegroundColor Yellow -NoNewline
$cleanNext = Read-Host
if ($cleanNext -eq "y" -or $cleanNext -eq "Y") {
    if (Test-Path .next) {
        Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
        Write-Host ".next directory removed" -ForegroundColor Green
    }
}

Write-Host "`nDone! Rebuild with:" -ForegroundColor Green
Write-Host "pnpm build" -ForegroundColor Cyan
