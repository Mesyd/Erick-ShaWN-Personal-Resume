# 仓库备份与远程同步说明

本文档记录当前个人简历网站的 Git 仓库整理、命名和备份策略。

## 仓库名称

展示名称：

```text
Erick ShaWN Personal Resume
```

建议远程仓库路径使用英文小写短横线，便于命令行、URL 和自动化脚本处理：

```text
erick-shawn-personal-resume
```

推荐仓库：

```text
Gitee  ：https://gitee.com/Erick_ShaWn/erick-sha-wn-personal-resume
GitHub ：https://github.com/Mesyd/Erick-ShaWN-Personal-Resume
```

## 推荐远程命名

```text
gitee   国内主备份
github  GitHub 同步备份
origin  当前平台内部仓库，保留即可
```

## 当前本地远程配置状态

本地已按以下地址配置远程名称：

```text
gitee   git@gitee.com:Erick_ShaWn/erick-sha-wn-personal-resume.git
github  git@github.com:Mesyd/Erick-ShaWN-Personal-Resume.git
```

正式推送前需要确认：

1. Gitee 和 GitHub 上已经创建同名仓库。
2. 本机 SSH 公钥已经添加到 Gitee 和 GitHub。
3. `gitee.com` 和 `github.com` 已经写入本机 `known_hosts`。

## 首次添加远程仓库

如果远程仓库已经创建，可以执行：

```bash
git remote add gitee git@gitee.com:Erick_ShaWn/erick-sha-wn-personal-resume.git
git remote add github git@github.com:Mesyd/Erick-ShaWN-Personal-Resume.git
```

如果本机没有配置 SSH Key，也可以使用 HTTPS 地址，但推荐使用 SSH，避免反复输入账号密码。

## 日常同步流程

1. 本地完成修改。
2. 执行构建验证。
3. 提交 Git。
4. 同步到 Gitee 和 GitHub。

```bash
pnpm run build
git status
git add README.md docs scripts package.json pnpm-lock.yaml app public
git commit -m "Maintain resume site project docs"
git push gitee main
git push github main
```

如果只是同步已有提交：

```bash
git push gitee main
git push github main
```

## 不应提交的内容

以下内容不应进入远程仓库：

- `.deploy/`：包含部署临时文件和服务器连接材料。
- `node_modules/`：依赖安装目录。
- `dist/`、`.vinext/`、`.wrangler/`：构建和运行产物。
- `outputs/`：压缩包、临时导出物。
- `项目照片/`：原始项目照片素材目录。
- `.env*`：环境变量和敏感配置。

真正用于网站展示的图片应放在 `public/` 下，并经过压缩或缩略图处理。
