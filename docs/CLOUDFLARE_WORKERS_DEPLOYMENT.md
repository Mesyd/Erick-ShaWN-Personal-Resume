# Cloudflare Workers 部署说明

当前网站更适合部署到 Cloudflare Workers，而不是 Cloudflare Pages。

原因：

- 当前项目是 Vinext / React / Cloudflare Worker 兼容结构。
- OpenAI Sites 当前也是类似 Worker 运行模式。
- Cloudflare Pages 可以上传静态资源，但对当前 SSR / RSC / Worker 组合产物需要额外适配，容易出现页面退化成静态展示、交互不完整的问题。
- Workers 部署可以直接使用 `dist/server/index.js` 和 `dist/client` 静态资源，更接近原始运行方式。

## 当前 Worker 地址

```text
https://erick-resume-worker.yudong-sha.workers.dev
```

## 配置文件

Workers 部署配置在：

```text
wrangler.worker.jsonc
```

关键配置：

```jsonc
{
  "name": "erick-resume-worker",
  "main": "dist/server/index.js",
  "compatibility_date": "2026-05-15",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "dist/client"
  }
}
```

## 部署命令

先构建：

```powershell
$env:Path = "C:\Users\Erick\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\Erick\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback;" + $env:Path
$env:WRANGLER_LOG_PATH = "I:\Blog_Sites\.wrangler\wrangler.log"
.\node_modules\.bin\vinext.CMD build
```

再部署 Worker：

```powershell
.\node_modules\.bin\wrangler.CMD deploy --config wrangler.worker.jsonc
```

## 推荐域名绑定方式

正式投递简历时，建议把你的自定义域名绑定到 Worker。

Cloudflare Dashboard 路径：

```text
Workers & Pages
→ erick-resume-worker
→ Settings
→ Triggers
→ Custom Domains
→ Add Custom Domain
```

如果你的域名 DNS 已经托管到 Cloudflare，绑定会更顺。

## 与 Pages 的取舍

建议：

- 正式简历站：Cloudflare Workers。
- Pages：仅保留为测试，不作为最终投递入口。

原因：

- Workers 更符合当前项目产物。
- 动画、鼠标交互、Galaxy 背景、图片组件等前端效果更不容易被部署适配破坏。
- 后续绑定域名后，HR 访问的是你的独立域名，不需要暴露 `workers.dev`。
