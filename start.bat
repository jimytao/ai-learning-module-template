@echo off
chcp 65001 > nul
echo =============================================================
echo 🚀 AI Learning Module - Launcher
echo =============================================================

if exist "server.js" (
    echo [INFO] Found server.js. Starting Node server...
    node server.js
) else if exist "scripts\preview_server.js" (
    echo [INFO] Found scripts\preview_server.js. Starting Node server...
    node scripts\preview_server.js
) else (
    echo [ERROR] No server.js or scripts\preview_server.js found.
    echo [ERROR] Please complete Phase 0 initialization and build/copy the browser server first.
    echo.
    echo Once you have created server.js or scripts\preview_server.js,
    echo run this start.bat script again to launch the browser companion.
    echo =============================================================
    pause
)
