@echo off
REM ====== One-click APK build for Capacitor/Android (Windows) ======
REM Edit the variable BELOW if your android folder is in a different place

REM -------------- CONFIG --------------
set PROJECT_DIR=%~dp0
set ANDROID_DIR=%PROJECT_DIR%android
REM If your android folder is named something else or in a different path, update ANDROID_DIR.
REM e.g.: set ANDROID_DIR=C:\path\to\your\project\android

REM -------------- CHECKS --------------
echo.
echo === One-click build started ===
echo Project folder: %PROJECT_DIR%
echo Android folder: %ANDROID_DIR%
echo.

REM -------------- STEP 1: Install deps (optional) --------------
echo 1) Installing npm dependencies (npm install)...
cd /d "%PROJECT_DIR%"
call npm install --no-audit --no-fund
if ERRORLEVEL 1 (
  echo npm install failed. Fix npm errors and re-run.
  pause
  exit /b 1
)

REM -------------- STEP 2: Build web app --------------
echo.
echo 2) Building web app (npm run build)...
call npm run build
if ERRORLEVEL 1 (
  echo npm run build failed. Check build errors.
  pause
  exit /b 1
)

REM -------------- STEP 3: Capacitor sync/copy --------------
echo.
echo 3) Copying web assets to Android project (npx cap sync android)...
call npx cap sync android
if ERRORLEVEL 1 (
  echo npx cap sync failed. Ensure Capacitor is installed and android platform exists.
  pause
  exit /b 1
)

REM -------------- STEP 4: Build APK with Gradle --------------
echo.
echo 4) Building debug APK with Gradle wrapper...
if exist "%ANDROID_DIR%\gradlew.bat" (
  cd /d "%ANDROID_DIR%"
  call gradlew.bat assembleDebug
) else (
  echo gradlew.bat not found in "%ANDROID_DIR%". Did you run "npx cap add android"?
  pause
  exit /b 1
)

REM -------------- STEP 5: Report APK path --------------
set APK_PATH=%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk
echo.
if exist "%APK_PATH%" (
  echo APK built successfully:
  echo %APK_PATH%
  echo.
  echo You can copy this APK to your phone (USB, cloud, email) and install.
) else (
  echo Build finished but APK not found at expected path:
  echo %APK_PATH%
  echo Check the build logs above for errors.
  pause
  exit /b 1
)

echo.
echo === Build script finished ===
pause
