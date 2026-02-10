# 显示内容修改指南

## 📍 修改位置速查表

### 1. 导航栏标题和按钮
**文件**: `frontend/src/App.tsx`  
**位置**: 第 77-88 行

```tsx
<nav className="navbar">
  <div className="navbar-brand">
    <h1>📚 全渠道内容收藏助手</h1>  {/* 👈 修改这里改标题 */}
  </div>
  <div className="navbar-actions">
    <button className="btn btn-primary" onClick={() => setShowPasteDialog(true)}>
      📎 粘贴链接  {/* 👈 修改按钮文字 */}
    </button>
    <button className="btn btn-secondary" onClick={loadCollections}>
      🔄 刷新列表  {/* 👈 修改按钮文字 */}
    </button>
  </div>
</nav>
```

---

### 2. 统计数字和标签
**文件**: `frontend/src/App.tsx`  
**位置**: 第 93-103 行

```tsx
<div className="stats-bar">
  <div className="stat-item">
    <span className="stat-number">{collections.length}</span>
    <span className="stat-label">收藏总数</span>  {/* 👈 修改标签文字 */}
  </div>
  <div className="stat-item">
    <span className="stat-number">5</span>  {/* 👈 修改数字 */}
    <span className="stat-label">支持平台</span>  {/* 👈 修改标签文字 */}
  </div>
</div>
```

**添加更多统计项**:
```tsx
<div className="stat-item">
  <span className="stat-number">12</span>
  <span className="stat-label">本周新增</span>
</div>
```

---

### 3. 书架标题
**文件**: `frontend/src/App.tsx`  
**位置**: 第 108 行

```tsx
<h2 className="section-title">我的收藏</h2>  {/* 👈 修改书架标题 */}
```

---

### 4. 空状态提示
**文件**: `frontend/src/App.tsx`  
**位置**: 第 120-127 行

```tsx
<div className="empty-state">
  <div className="empty-icon">📖</div>  {/* 👈 修改图标 */}
  <h2>书架空空如也</h2>  {/* 👈 修改标题 */}
  <p>复制链接或点击"粘贴链接"按钮开始收藏</p>  {/* 👈 修改提示文字 */}
  <button className="btn btn-large btn-primary" onClick={() => setShowPasteDialog(true)}>
    📎 开始收藏  {/* 👈 修改按钮文字 */}
  </button>
</div>
```

---

### 5. 内容卡片显示
**文件**: `frontend/src/components/ContentCard.tsx`  
**位置**: 整个文件

```tsx
// 卡片标题
<h3 className="card-title">{item.title}</h3>

// 卡片描述
<p className="card-description">{item.description}</p>

// 平台图标和作者
<div className="card-meta">
  <span className="platform-icon">{getPlatformIcon(item.platform)}</span>
  <span>{item.author}</span>
  <span>{formatDate(item.createdAt)}</span>
</div>
```

---

### 6. 对话框文字
**文件**: `frontend/src/App.tsx`  
**位置**: 第 145-163 行

```tsx
<div className="dialog">
  <h2>粘贴链接</h2>  {/* 👈 修改对话框标题 */}
  <p>支持：知乎、微信公众号、小红书、抖音、B站</p>  {/* 👈 修改提示文字 */}
  <div className="form-group">
    <input
      type="text"
      placeholder="粘贴链接到这里..."  {/* 👈 修改占位符 */}
      value={manualUrl}
      onChange={(e) => setManualUrl(e.target.value)}
    />
  </div>
  <div className="dialog-actions">
    <button onClick={() => setShowPasteDialog(false)}>取消</button>  {/* 👈 修改按钮 */}
    <button onClick={handleManualPaste}>确认</button>  {/* 👈 修改按钮 */}
  </div>
</div>
```

---

## 🎨 样式修改位置

### 1. 背景图片
**文件**: `frontend/src/index.css`  
**位置**: 第 11 行

```css
body {
  background: url('/background.jpg?v=1') center/cover no-repeat fixed;
  background-color: #f5f5f5;  /* 👈 修改备用背景色 */
}
```

**更换背景图片**:
1. 将新图片放到 `frontend/public/` 文件夹
2. 修改 CSS 中的路径: `url('/your-image.jpg')`

---

### 2. 主题颜色
**文件**: `frontend/src/index.css`  
**位置**: 第 25 行

```css
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 👈 修改导航栏渐变色 */
}
```

**其他颜色位置**:
- 统计数字颜色: 第 103 行 `color: #667eea;`
- 按钮颜色: 第 56 行 `.btn-primary`
- 卡片顶部装饰: 第 157 行 `background: linear-gradient(90deg, #667eea, #764ba2);`

---

### 3. 卡片样式
**文件**: `frontend/src/index.css`  
**位置**: 第 143-240 行

```css
.content-card {
  height: 380px;  /* 👈 修改卡片高度 */
  border-radius: 12px;  /* 👈 修改圆角 */
}

.card-image {
  height: 200px;  /* 👈 修改图片高度 */
}

.card-title {
  font-size: 1.1rem;  /* 👈 修改标题字体大小 */
  -webkit-line-clamp: 2;  /* 👈 修改标题显示行数 */
}
```

---

### 4. 网格布局
**文件**: `frontend/src/index.css`  
**位置**: 第 135 行

```css
.bookshelf-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));  /* 👈 修改卡片最小宽度 */
  gap: 2rem;  /* 👈 修改卡片间距 */
}
```

**调整每行显示数量**:
- 3列: `minmax(350px, 1fr)`
- 4列: `minmax(280px, 1fr)` (当前)
- 5列: `minmax(220px, 1fr)`

---

## 🔧 常见修改示例

### 示例1: 修改导航栏标题为英文
```tsx
// frontend/src/App.tsx 第 79 行
<h1>📚 Universal Content Collector</h1>
```

### 示例2: 添加更多统计项
```tsx
// frontend/src/App.tsx 第 93 行后添加
<div className="stat-item">
  <span className="stat-number">{collections.filter(c => c.platform === 'wechat').length}</span>
  <span className="stat-label">微信文章</span>
</div>
```

### 示例3: 修改主题色为蓝绿色
```css
/* frontend/src/index.css */
.navbar {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-number {
  color: #11998e;
}
```

### 示例4: 修改卡片为更大尺寸
```css
/* frontend/src/index.css */
.bookshelf-grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.content-card {
  height: 450px;
}

.card-image {
  height: 250px;
}
```

---

## 📝 修改后的操作

1. **保存文件** (Ctrl+S)
2. **浏览器刷新** (Ctrl+Shift+R 强制刷新)
3. **查看效果**

如果修改后没有生效:
- 检查浏览器控制台是否有错误 (F12)
- 确认开发服务器正在运行 (`npm run dev`)
- 尝试重启开发服务器

---

## 🎯 快速定位技巧

1. **搜索关键词**: 在 VS Code 中按 Ctrl+F 搜索你想修改的文字
2. **查看组件**: 所有显示内容都在 `frontend/src/App.tsx` 和 `frontend/src/components/` 中
3. **查看样式**: 所有样式都在 `frontend/src/index.css` 中
4. **使用浏览器开发工具**: F12 打开，可以实时预览样式修改效果
