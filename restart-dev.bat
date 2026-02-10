@echo off
echo ========================================
echo 清除缓存并重启开发服务器
echo ========================================
echo.

echo [1/4] 清除Vite缓存...
if exist "frontend\node_modules\.vite" (
    rmdir /s /q "frontend\node_modules\.vite"
    echo ✓ Vite缓存已清除
) else (
    echo ℹ 没有找到Vite缓存
)

echo [2/4] 清除dist目录...
if exist "frontend\dist" (
    rmdir /s /q "frontend\dist"
    echo ✓ dist目录已清除
) else (
    echo ℹ 没有找到dist目录
)

echo [3/4] 清除.vite目录...
if exist "frontend\.vite" (
    rmdir /s /q "frontend\.vite"
    echo ✓ .vite目录已清除
) else (
    echo ℹ 没有找到.vite目录
)

echo.
echo [4/4] 启动开发服务器...
echo.
npm run dev
