# 项目维护说明

本文档用于后续维护当前个人简历网站。

## 当前部署结论

当前正式部署路径为：

```text
本地项目
  ↓
Git 提交
  ↓
打包当前提交
  ↓
上传到 ECS release 目录
  ↓
服务器构建
  ↓
切换 /opt/shayudong-resume/current
  ↓
重启 shayudong-resume.service
```

当前不再维护 Cloudflare Pages / Workers 部署方案。

## 目录职责

- `app/`：网站页面、组件和全局样式。
- `public/`：网站公开静态资源。
- `public/project-photos/`：项目原图，点击大图预览时使用。
- `public/project-photos-thumbs/`：项目展示区缩略图，优先加载。
- `项目照片/`：原始项目照片目录，不直接作为部署资源。
- `scripts/generate_project_thumbnails.py`：生成项目照片 WebP 缩略图。
- `outputs/`：打包或临时输出目录，不作为源码维护重点。
- `dist/`：构建输出目录，由构建命令生成，不手动编辑。
- `.openai/hosting.json`：历史 OpenAI Sites 配置，保留但当前不是主要部署入口。

## 后续更新项目照片

1. 把原图放到 `项目照片/` 或直接整理到 `public/project-photos/` 对应项目目录。
2. 检查 `app/page.tsx` 中 `projectImageAlbums` 和 `smallProjectAlbums` 的图片顺序、标题和说明。
3. 运行缩略图生成脚本：

   ```bash
   python scripts/generate_project_thumbnails.py
   ```

4. 确认 `public/project-photos-thumbs/` 生成对应 WebP 缩略图。
5. 构建验证通过后再发布 ECS。

## 维护原则

- 页面展示类修改集中在 `app/page.tsx` 和 `app/globals.css`。
- 不要直接让列表区加载大尺寸原图，展示区优先使用 `project-photos-thumbs`。
- 不要提交 `dist/`、`outputs/`、`node_modules/`、`.wrangler/` 等构建或缓存目录。
- 对外投递前，确认联系方式、项目描述和是否公开访问符合预期。

## ECS 常用命令

```bash
systemctl status shayudong-resume
systemctl restart shayudong-resume
journalctl -u shayudong-resume -f
nginx -t
systemctl reload nginx
```
