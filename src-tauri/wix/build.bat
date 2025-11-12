@echo off
setlocal

set WIXPATH=%USERPROFILE%\AppData\Local\tauri\WixTools314
set WXS=flexierp.wxs
set WIXOBJ=flexierp.wixobj
set MSI=flexierp-debug.msi
set Win64=yes
set ProductName=FlexiERP
set Version=1.0.0

echo 🧩 Running candle.exe...
"%WIXPATH%\candle.exe" "%WXS%" -out "%WIXOBJ%" -dWin64=%Win64% -dProductName=%ProductName% -dVersion=%Version% -v
if %errorlevel% neq 0 (
    echo ❌ Candle failed. Check your .wxs syntax.
    pause
    exit /b %errorlevel%
)

echo 🔧 Running light.exe...
"%WIXPATH%\light.exe" "%WIXOBJ%" -out "%MSI%" -ext WixUIExtension -cultures:en-us -loc tauri.wxl ^
-sice:ICE38 -sice:ICE64 -sice:ICE60 -sice:ICE61 -sice:ICE40
if %errorlevel% neq 0 (
    echo ❌ Light failed. Check component references and ICE suppressions.
    pause
    exit /b %errorlevel%
)

echo ✅ Build succeeded! Output file: %MSI%
pause
