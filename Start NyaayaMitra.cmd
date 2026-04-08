@echo off
cd /d "%~dp0"
title NyaayaMitra Launchpad
echo Starting NyaayaMitra Launchpad on http://localhost:4317
echo.
node server\index.js
pause
