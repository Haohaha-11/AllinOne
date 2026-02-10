# Git 命令快速参考

## 首次推送到GitHub

```bash
# 1. 初始化Git（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Ready for deployment"

# 4. 连接到你的GitHub仓库
git remote add origin https://github.com/Haohaha-11/AllinOne.git

# 5. 设置主分支
git branch -M main

# 6. 推送到GitHub
git push -u origin main
```

---

## 后续更新

每次修改代码后：

```bash
# 1. 查看修改了哪些文件
git status

# 2. 添加所有修改
git add .

# 3. 提交修改（写上修改说明）
git commit -m "修改说明"

# 4. 推送到GitHub
git push
```

推送后，Vercel和Railway会自动部署新版本！

---

## 常用命令

### 查看状态
```bash
git status
```

### 查看提交历史
```bash
git log
```

### 查看远程仓库
```bash
git remote -v
```

### 拉取最新代码
```bash
git pull
```

### 撤销修改（未提交）
```bash
# 撤销单个文件
git checkout -- 文件名

# 撤销所有修改
git checkout -- .
```

### 撤销提交（已提交但未推送）
```bash
# 撤销最后一次提交，保留修改
git reset --soft HEAD~1

# 撤销最后一次提交，丢弃修改
git reset --hard HEAD~1
```

---

## 分支操作

### 创建新分支
```bash
git branch 分支名
```

### 切换分支
```bash
git checkout 分支名
```

### 创建并切换到新分支
```bash
git checkout -b 分支名
```

### 合并分支
```bash
# 先切换到主分支
git checkout main

# 合并其他分支
git merge 分支名
```

### 删除分支
```bash
git branch -d 分支名
```

---

## 常见问题

### Q: 如何查看我的GitHub仓库地址？
```bash
git remote -v
```

### Q: 推送时提示"没有权限"
**解决：**
1. 确认GitHub账号已登录
2. 检查SSH密钥或使用HTTPS
3. 使用GitHub Desktop工具

### Q: 推送时提示"冲突"
**解决：**
```bash
# 先拉取最新代码
git pull

# 解决冲突后再推送
git push
```

### Q: 如何忽略某些文件？
在 `.gitignore` 文件中添加文件名或路径

### Q: 如何查看某个文件的修改历史？
```bash
git log -- 文件名
```

---

## 你的仓库信息

- **GitHub仓库**: https://github.com/Haohaha-11/AllinOne
- **主分支**: main
- **远程名称**: origin

---

## 快速参考

| 命令 | 说明 |
|------|------|
| `git status` | 查看状态 |
| `git add .` | 添加所有修改 |
| `git commit -m "说明"` | 提交修改 |
| `git push` | 推送到GitHub |
| `git pull` | 拉取最新代码 |
| `git log` | 查看历史 |
| `git branch` | 查看分支 |
| `git checkout 分支名` | 切换分支 |

---

## 工作流程

### 日常开发
```bash
# 1. 拉取最新代码
git pull

# 2. 修改代码...

# 3. 查看修改
git status

# 4. 添加修改
git add .

# 5. 提交
git commit -m "修改了XXX功能"

# 6. 推送
git push
```

### 部署更新
```bash
# 推送到GitHub后，Vercel和Railway会自动部署
git push

# 等待1-2分钟
# 访问你的应用URL查看更新
```

---

## 提交信息规范

好的提交信息示例：
- ✅ `添加了搜索功能`
- ✅ `修复了图片显示问题`
- ✅ `优化了移动端布局`
- ✅ `更新了部署文档`

不好的提交信息：
- ❌ `update`
- ❌ `fix`
- ❌ `修改`

---

## Git配置

### 设置用户名和邮箱
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 查看配置
```bash
git config --list
```

---

## 需要帮助？

- Git官方文档：https://git-scm.com/doc
- GitHub帮助：https://docs.github.com
- Git教程：https://www.liaoxuefeng.com/wiki/896043488029600
