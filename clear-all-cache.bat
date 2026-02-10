@echo off
echo ========================================
echo 清除所有缓存
echo ========================================
echo.

echo [1/3] 清除Vite缓存...
if exist "frontend\node_modules\.vite" (
    rmdir /s /q "frontend\node_modules\.vite"
    echo ✓ Vite缓存已清除
) else (
    echo ℹ 没有找到Vite缓存
)
echo.

echo [2/3] 清除dist目录...
if exist "frontend\dist" (
    rmdir /s /q "frontend\dist"
    echo ✓ dist目录已清除
) else (
    echo ℹ 没有找到dist目录
)
echo.

echo [3/3] 完成！
echo.
echo ========================================
echo 下一步操作：
echo ========================================
echo 1. 在浏览器中按 Ctrl + Shift + Delete
echo 2. 选择"全部"时间范围
echo 3. 勾选所有选项
echo 4. 点击"清除数据"
echo 5. 关闭浏览器
echo 6. 重新打开浏览器
echo 7. 访问 http://localhost:3000
echo ========================================
echo.
pause
