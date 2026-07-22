# Erick ShaWN Personal Resume

这是一个“个人简历 + 技术博客入口”网站，当前基于 Vinext / React 构建，并部署在阿里云 ECS 上。

项目中文用途：沙宇栋个人简历网站。  
项目英文名称：Erick ShaWN Personal Resume。

当前线上访问入口：

```text
http://118.190.155.166
```

域名：

```text
shayudong.website
www.shayudong.website
```

域名目前等待 ICP 备案完成后再正式启用 HTTPS。

## 常用文档

- [项目维护说明](docs/PROJECT_MAINTENANCE.md)
- [阿里云 Node + systemd 部署记录](docs/ALIYUN_NODE_SYSTEMD_DEPLOYMENT.md)
- [阿里云 Docker 部署备用方案](docs/ALIYUN_DOCKER_DEPLOYMENT.md)
- [仓库备份与远程同步说明](docs/REPOSITORY_BACKUP.md)
- [发布检查清单](docs/RELEASE_CHECKLIST.md)

## 目录说明

- `app/`：网站页面、组件、样式和交互逻辑。
- `public/`：最终随网站发布的公开静态资源。
- `public/project-photos/`：项目原图，点击大图时使用。
- `public/project-photos-thumbs/`：项目展示区 WebP 缩略图，用于提升加载速度。
- `项目照片/`：原始项目照片素材，不直接部署。
- `scripts/generate_project_thumbnails.py`：从项目原图生成 WebP 缩略图。
- `dist/`、`.vinext/`、`.wrangler/`：构建或运行产物，不手动维护。
- `.openai/hosting.json`：历史 OpenAI Sites 项目配置，保留但当前不作为主要部署入口。

## 常用命令

```bash
pnpm install
pnpm run dev
pnpm run build
```

生成一份干净的源码压缩包：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package_source.ps1
```

## 当前部署方式

当前 ECS 运行结构：

```text
Nginx 80 端口
  ↓
systemd 常驻服务 shayudong-resume.service
  ↓
Vinext 生产服务 127.0.0.1:3000
```

本地项目不会自动同步到 ECS。每次修改后，需要重新打包、上传、构建并重启 ECS 服务。

## 当前维护策略

- Gitee 作为国内主备份仓库。
- GitHub 作为海外备份仓库。
- ECS 只运行已经打包发布的生产版本，不直接作为源码仓库。
- `dist/`、`.vinext/`、`.wrangler/`、`outputs/`、`node_modules/`、`.deploy/` 和原始 `项目照片/` 不提交到远程仓库。
