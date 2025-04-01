@echo off
echo ===================================
echo Front-end Website Deployment Script
echo ===================================
echo.

echo Step 1: Installing dependencies...
call npm install || call pnpm install || call yarn install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies.
    echo Please make sure Node.js is installed.
    pause
    exit /b 1
)
echo Dependencies installed successfully.
echo.

echo Step 2: Building the project...
call npm run build || call pnpm run build || call yarn build
if %ERRORLEVEL% NEQ 0 (
    echo Error: Build failed.
    pause
    exit /b 1
)
echo Project built successfully.
echo.

echo Step 3: Starting the server...
echo The website will open in your default browser.
echo Press Ctrl+C to stop the server when you're done.
echo.
call npm run preview || call pnpm run preview || call yarn preview

pause