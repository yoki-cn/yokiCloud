@echo off
setlocal

where pwsh >nul 2>nul
if %errorlevel%==0 (
  set "PS_CMD=pwsh"
) else (
  set "PS_CMD=powershell"
)

"%PS_CMD%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1" %*
exit /b %errorlevel%

