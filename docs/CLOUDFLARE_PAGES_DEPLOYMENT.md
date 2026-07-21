# Cloudflare Pages 部署说明

当前项目可以部署到 Cloudflare Pages，但不是“纯静态站点”模式。

本项目使用 Vinext / React 构建，产物包含：

- `dist/client/`：静态资源、图片、CSS、前端 JS。
- `dist/server/index.js`：Cloudflare Worker 兼容的服务端入口。

因此部署到 Cloudflare Pages 时，需要使用 Pages Functions 的 `_worker.js` advanced mode，而不是只上传 `dist/client/`。

## 适配方式

先正常构建项目：

```powershell
$env:Path = "C:\Users\Erick\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\Erick\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;" + $env:Path
$env:WRANGLER_LOG_PATH = "I:\Blog_Sites\.wrangler\wrangler.log"
.\node_modules\.bin\vinext.CMD build
```

然后生成 Cloudflare Pages 上传目录：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\prepare_cloudflare_pages.ps1
```

脚本会生成：

```text
outputs/cloudflare-pages/
```

该目录包含：

- 静态资源；
- `_worker.js`；
- SSR / RSC 运行所需的 server 文件。

## Cloudflare Pages 项目设置

在 Cloudflare Pages 中创建项目后，需要确认 Functions 运行环境支持当前构建产物。

建议设置：

- Compatibility date：`2026-05-15` 或更新日期；
- Compatibility flags：`nodejs_compat`。

如果没有启用 `nodejs_compat`，当前 `_worker.js` 中的 Node 兼容模块可能无法正常运行。

## Direct Upload 部署命令

首次需要登录 Cloudflare：

```powershell
.\node_modules\.bin\wrangler.CMD login
```

登录后部署：

```powershell
.\node_modules\.bin\wrangler.CMD pages deploy "I:\Blog_Sites\outputs\cloudflare-pages" --project-name erick-resume
```

如果项目不存在，可以先在 Cloudflare Dashboard 里创建 Pages 项目，再执行上面的部署命令。

## 推荐流程

1. 在 Cloudflare Dashboard 创建 Pages 项目，例如 `erick-resume`。
2. 在项目设置里启用 `nodejs_compat`。
3. 本地运行 Vinext build。
4. 运行 `scripts/prepare_cloudflare_pages.ps1`。
5. 使用 `wrangler pages deploy` 上传 `outputs/cloudflare-pages`。
6. 部署成功后，用 Cloudflare 提供的 `*.pages.dev` 预览效果。
7. 确认无问题后，绑定你的备案域名。

## 注意事项

- 不要只上传 `dist/client/`，否则可能缺少服务端渲染入口。
- `outputs/cloudflare-pages/` 是部署产物，不需要提交到 Git。
- 每次修改页面后，都需要重新 build、重新生成 Pages 上传目录、重新 deploy。

## 官方参考

- Cloudflare Pages Direct Upload：https://developers.cloudflare.com/pages/get-started/direct-upload/
- Cloudflare Pages Functions Advanced Mode：https://developers.cloudflare.com/pages/functions/advanced-mode/
- Cloudflare Pages 自定义域名：https://developers.cloudflare.com/pages/configuration/custom-domains/
