# 项目维护说明

本文档只用于后续维护当前个人简历网站，不影响页面显示效果。

## 目录职责

- `app/`：网站页面、组件和全局样式。
- `public/`：网站公开静态资源，包含头像、项目照片等。
- `项目照片/`：原始项目照片目录，已加入忽略规则，不直接作为部署资源。
- `scripts/prepare_project_photos.py`：把 `项目照片/` 中的原始图片、PDF、TIF 转换为网站可用的压缩 JPG。
- `outputs/`：部署打包产物目录，不作为源码维护重点。
- `dist/`：构建输出目录，由构建命令生成，不手动编辑。
- `.openai/hosting.json`：当前 OpenAI Sites 项目配置，不要随意修改 `project_id`。

## 后续更新项目照片

1. 把原图放到 `项目照片/` 下对应项目目录中。
2. 如果是 200W DAB 样机这类需要固定顺序的项目，更新 `scripts/prepare_project_photos.py` 中的 `ORDERED_EXPORTS`。
3. 运行图片处理脚本，生成 `public/project-photos/...` 下的压缩图片。
4. 检查 `app/page.tsx` 中 `projectImageAlbums` 的标题、说明和图片顺序。
5. 构建验证通过后再部署。

## 维护原则

- 页面展示类修改集中在 `app/page.tsx` 和 `app/globals.css`。
- 图片资源不要直接引用 `项目照片/` 原图，应先转换到 `public/project-photos/`。
- 不要提交 `dist/`、`outputs/`、`node_modules/`、`.wrangler/` 等构建或缓存目录。
- 对外投递前，确认联系方式、项目描述和是否公开访问符合预期。

## 当前项目适合的部署类型

当前项目不是普通静态 HTML，而是 Vinext / React / Cloudflare Worker 兼容结构。  
如果部署到 Cloudflare，优先考虑：

1. Cloudflare Workers / OpenNext 类部署。
2. 或改造成纯静态导出后部署到 Cloudflare Pages。

直接把当前源码当作普通 Cloudflare Pages 静态站点部署，可能需要额外适配。
