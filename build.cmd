@echo off
SETLOCAL EnableDelayedExpansion

SET CLIENT_DIR=.\client
SET API_DIR=.\api

echo Building Client...
cd %CLIENT_DIR%
call npm run build
echo Done!

cd ..

echo Building API...
cd %API_DIR%
call npm run build
echo Done!

cd ..

echo Installing dependencies...
xcopy %CLIENT_DIR%\package.json dist\client /Y
xcopy %CLIENT_DIR%\.env dist\client /Y
xcopy %API_DIR%\package.json dist\api /Y
xcopy package.json dist\ /Y
xcopy package-lock.json dist\ /Y
xcopy LICENSE dist\ /Y

cd dist

call npm ci --omit=dev
echo Done!