# 沙宇栋个人简历网站

这是一个“个人简历 + 技术博客入口”网站，当前基于 Vinext / React 构建，并通过 OpenAI Sites 保存与部署。

当前阶段以公开访问、内容维护和后续自定义域名部署准备为主。页面视觉与交互代码集中在 `app/` 目录，原始项目照片保存在 `项目照片/` 目录，部署相关说明保存在 `docs/` 目录。

## 常用文档

- [项目维护说明](docs/PROJECT_MAINTENANCE.md)
- [公开部署指南](docs/PUBLIC_DEPLOYMENT_GUIDE.md)
- [Cloudflare Pages 部署说明](docs/CLOUDFLARE_PAGES_DEPLOYMENT.md)

## 目录说明

- `app/`：网站页面、组件、样式和交互逻辑。
- `public/`：最终会随网站一起发布的静态资源。
- `项目照片/`：原始项目照片素材，已加入 `.gitignore`，不直接部署。
- `scripts/prepare_project_photos.py`：项目照片压缩、转换和导出脚本。
- `outputs/`、`dist/`、`.vinext/`、`.wrangler/`：构建或运行产物，不手动维护。
- `.openai/hosting.json`：OpenAI Sites 项目配置，里面的 `project_id` 不要随意修改。

## 常用命令

```bash
npm install
npm run dev
npm run build
```

## 后续公开访问建议

网站正式公开前，建议先完成以下准备：

1. 确认简历内容、项目图片、联系方式都适合长期公开展示。
2. 确认是否继续使用当前 OpenAI Sites，还是迁移到 Cloudflare Pages / Workers。
3. 如果购买独立域名，优先选择简短、易输入、和姓名或英文名相关的域名。
4. 若部署在中国大陆服务器或大陆云产品上，提前确认 ICP 备案要求。
