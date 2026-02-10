# 🎨 界面定制指南

## 📍 修改显示内容的位置

### 1. 修改标题和文字

**文件**: `frontend/src/App.tsx`

```typescript
// 第 60 行 - 修改网站标题
<h1>📚 全渠道内容收藏助手</h1>
// 改成你想要的，例如：
<h1>📚 我的知识库</h1>

// 第 62-64 行 - 修改按钮文字
<button className="btn btn-primary" onClick={() => setShowPasteDialog(true)}>
  📎 粘贴链接  // 改成你想要的文字
</button>

// 第 89-91 行 - 修改空状态文字
<h2>书架空空如也</h2>
<p>复制链接或点击"粘贴链接"按钮开始收藏</p>
```

### 2. 修改背景图片

**方法1: 替换图片文件**
- 将你的图片命名为 `background.jpg`
- 放到 `frontend/public/` 目录
- 刷新浏览器（Ctrl+Shift+R 强制刷新）

**方法2: 修改CSS**

**文件**: `frontend/src/index.css`

```css
/* 第 11 行 - 修改背景 */
body {
  background: url('/background.jpg') center/cover fixed;
  /* 或者使用纯色背景 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 或者使用其他图片 */
  background: url('/your-image.jpg') center/cover fixed;
}
```

### 3. 修改颜色主题

**文件**: `frontend/src/index.css`

```css
/* 第 24-25 行 - 导航栏颜色 */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 改成其他颜色，例如蓝色 */
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  /* 或者红色 */
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* 或者绿色 */
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* 第 82 行 - 统计数字颜色 */
.stat-number {
  color: #667eea;  /* 改成你喜欢的颜色 */
}

/* 第 115 行 - 卡片顶部装饰条 */
.content-card::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
  /* 改成其他颜色 */
}
```

### 4. 修改卡片布局

**文件**: `frontend/src/index.css`

```css
/* 第 103 行 - 卡片网格布局 */
.bookshelf-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  /* 改成更大的卡片 */
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  /* 或者固定3列 */
  grid-template-columns: repeat(3, 1fr);
  /* 或者固定4列 */
  grid-template-columns: repeat(4, 1fr);
}

/* 第 112 行 - 卡片高度 */
.content-card {
  height: 380px;  /* 改成你想要的高度 */
}
```

### 5. 修改统计信息

**文件**: `frontend/src/App.tsx`

```typescript
// 第 72-80 行 - 修改统计卡片
<div className="stat-item">
  <span className="stat-number">{collections.length}</span>
  <span className="stat-label">收藏总数</span>  // 改成你想要的文字
</div>
<div className="stat-item">
  <span className="stat-number">5</span>  // 改成其他数字
  <span className="stat-label">支持平台</span>  // 改成你想要的文字
</div>
```

---

## 🎨 常用颜色方案

### 蓝色主题
```css
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

### 粉色主题
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### 绿色主题
```css
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
```

### 橙色主题
```css
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
```

### 深色主题
```css
background: linear-gradient(135deg, #434343 0%, #000000 100%);
```

---

## 🔄 如何应用修改

1. **修改文件后保存**
2. **浏览器会自动刷新**（Vite 热更新）
3. **如果没有刷新，按 F5 或 Ctrl+R**
4. **如果还是没变化，按 Ctrl+Shift+R 强制刷新**

---

## 🖼️ 背景图片不显示？

### 解决方法：

1. **检查图片是否存在**
   ```bash
   # 在项目目录运行
   dir frontend\public\background.jpg
   ```

2. **强制刷新浏览器**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **清除浏览器缓存**
   - 打开开发者工具（F12）
   - 右键点击刷新按钮
   - 选择"清空缓存并硬性重新加载"

4. **检查图片路径**
   - 打开 `frontend/src/index.css`
   - 第 11 行应该是：`background: url('/background.jpg') center/cover fixed;`

5. **临时测试：使用纯色背景**
   ```css
   body {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   }
   ```

---

## 📝 快速定制示例

### 示例1: 改成深色主题

**frontend/src/index.css**
```css
body {
  background: #1a1a1a;
}

.app {
  background: rgba(30, 30, 30, 0.95);
}

.navbar {
  background: linear-gradient(135deg, #434343 0%, #000000 100%);
}
```

### 示例2: 改成简洁白色主题

**frontend/src/index.css**
```css
body {
  background: #f0f0f0;
}

.app {
  background: white;
}

.navbar {
  background: white;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}
```

---

## 🆘 需要帮助？

告诉我你想要：
1. 什么颜色主题？
2. 什么样的布局？
3. 显示什么文字？

我可以帮你直接修改代码！
