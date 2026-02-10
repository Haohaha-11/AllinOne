# Git 代理配置指南

## 问题说明

错误信息：`fatal: unable to access 'https://github.com/...': Recv failure: Connection was reset`

**原因**：在国内访问GitHub需要配置代理。

---

## 解决方案

### 方案1：配置Git使用代理（推荐）

#### 1.1 如果你有HTTP/HTTPS代理

```bash
# 设置HTTP代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 或者使用SOCKS5代理
git config --global http.proxy socks5://127.0.0.1:7890
git config --global https.proxy socks5://127.0.0.1:7890
```

**注意**：将 `7890` 替换为你的代理端口号。

常见代理端口：
- Clash: 7890
- V2Ray: 10808
- SSR: 1080

#### 1.2 只为GitHub设置代理

```bash
# 只对GitHub使用代理
git config --global http.https://github.com.proxy http://127.0.0.1:7890
git config --global https.https://github.com.proxy http://127.0.0.1:7890
```

#### 1.3 查看当前代理配置

```bash
git config --global --get http.proxy
git config --global --get https.proxy
```

#### 1.4 取消代理配置

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

### 方案2：使用SSH方式推送（推荐，更稳定）

#### 2.1 生成SSH密钥

```bash
# 生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 按Enter使用默认路径
# 可以设置密码或直接按Enter跳过
```

#### 2.2 查看公钥

```bash
# Windows
type %USERPROFILE%\.ssh\id_rsa.pub

# 或者直接打开文件
notepad %USERPROFILE%\.ssh\id_rsa.pub
```

#### 2.3 添加SSH密钥到GitHub

1. 复制公钥内容（以 `ssh-rsa` 开头）
2. 访问：https://github.com/settings/keys
3. 点击 "New SSH key"
4. Title: 随便填（如：My Computer）
5. Key: 粘贴公钥
6. 点击 "Add SSH key"

#### 2.4 测试SSH连接

```bash
ssh -T git@github.com
```

如果看到 `Hi Haohaha-11! You've successfully authenticated` 就成功了！

#### 2.5 修改远程仓库地址为SSH

```bash
# 查看当前远程地址
git remote -v

# 修改为SSH地址
git remote set-url origin git@github.com:Haohaha-11/AllinOne.git

# 验证
git remote -v
```

#### 2.6 推送代码

```bash
git push origin main
```

---

### 方案3：使用GitHub Desktop（最简单）

#### 3.1 下载安装

访问：https://desktop.github.com/

#### 3.2 登录GitHub账号

打开GitHub Desktop，登录你的账号

#### 3.3 添加仓库

1. File → Add Local Repository
2. 选择你的项目文件夹
3. 点击 "Add Repository"

#### 3.4 推送代码

1. 在左下角输入提交信息
2. 点击 "Commit to main"
3. 点击 "Push origin"

GitHub Desktop会自动处理代理问题！

---

## 推荐配置步骤

### 如果你有代理软件（Clash/V2Ray等）

**步骤1：找到代理端口**

打开你的代理软件，查看HTTP代理端口（通常是7890）

**步骤2：配置Git代理**

```bash
# 只为GitHub设置代理（推荐）
git config --global http.https://github.com.proxy http://127.0.0.1:7890
git config --global https.https://github.com.proxy http://127.0.0.1:7890
```

**步骤3：测试连接**

```bash
git ls-remote https://github.com/Haohaha-11/AllinOne.git
```

如果能看到分支信息，说明配置成功！

**步骤4：推送代码**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

### 如果没有代理软件

**推荐使用SSH方式**（见方案2）或 **GitHub Desktop**（见方案3）

---

## 常见代理软件端口

| 软件 | HTTP端口 | SOCKS5端口 |
|------|---------|-----------|
| Clash | 7890 | 7891 |
| V2Ray | 10809 | 10808 |
| SSR | 1087 | 1086 |
| Shadowsocks | 1087 | 1080 |

---

## 快速命令参考

### 配置代理（Clash为例）
```bash
git config --global http.https://github.com.proxy http://127.0.0.1:7890
git config --global https.https://github.com.proxy http://127.0.0.1:7890
```

### 测试连接
```bash
git ls-remote https://github.com/Haohaha-11/AllinOne.git
```

### 推送代码
```bash
git push origin main
```

### 取消代理
```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

## 故障排除

### 问题1：代理配置后仍然失败

**解决：**
1. 确认代理软件正在运行
2. 确认端口号正确
3. 尝试使用SOCKS5代理：
   ```bash
   git config --global http.proxy socks5://127.0.0.1:7890
   ```

### 问题2：SSH连接失败

**解决：**
1. 确认SSH密钥已添加到GitHub
2. 测试连接：`ssh -T git@github.com`
3. 如果还是失败，配置SSH代理：
   
   编辑 `~/.ssh/config`（Windows: `C:\Users\你的用户名\.ssh\config`）：
   ```
   Host github.com
       ProxyCommand connect -H 127.0.0.1:7890 %h %p
   ```

### 问题3：GitHub Desktop无法连接

**解决：**
1. 打开GitHub Desktop设置
2. 找到代理设置
3. 选择"使用系统代理"

---

## 推荐方案总结

### 有代理软件
1. ✅ 配置Git HTTP代理（最快）
2. ✅ 使用SSH方式（更稳定）

### 没有代理软件
1. ✅ 使用GitHub Desktop（最简单）
2. ✅ 配置SSH密钥

---

## 下一步

配置好代理后，继续部署：

```bash
# 1. 推送代码
git push origin main

# 2. 访问你的仓库确认
# https://github.com/Haohaha-11/AllinOne

# 3. 继续部署到Railway和Vercel
# 参考：开始部署.md
```

---

## 需要帮助？

如果还有问题，可以：
1. 检查代理软件是否正常运行
2. 尝试使用GitHub Desktop
3. 使用SSH方式代替HTTPS
