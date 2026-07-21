# Cloudflare Workers 部署说明

当前网站更适合部署到 Cloudflare Workers，而不是 Cloudflare Pages。

原因：

- 当前项目是 Vinext / React / Cloudflare Worker 兼容结构。
- OpenAI Sites 当前也是类似 Worker 的运行方式。
- Cloudflare Pages 更适合纯静态站点；当前项目如果强行按静态 Pages 发布，容易出现动画、交互、路由或加载状态不完整的问题。
- Workers 可以直接使用 `dist/server/index.js` 和 `dist/client` 静态资源，更接近当前网站的实际运行方式。

## 当前 Worker 地址

```text
https://erick-resume-worker.yudong-sha.workers.dev
```

## 当前自定义域名

计划绑定域名：

```text
shayudong.website
www.shayudong.website
```

当前状态：

- `shayudong.website` 仍使用阿里云 / HiChina DNS：
  - `dns1.hichina.com`
  - `dns2.hichina.com`
- Cloudflare Wrangler 暂时无法直接绑定该域名，错误原因是 Cloudflare 账号内还不能识别这个 Zone。
- 需要先在 Cloudflare Dashboard 添加 `shayudong.website`，并在阿里云域名控制台把 DNS 服务器改成 Cloudflare 提供的两条 nameserver。

Cloudflare 接管域名后，再把 `wrangler.worker.jsonc` 增加下面的路由：

```jsonc
"routes": [
  { "pattern": "shayudong.website", "custom_domain": true },
  { "pattern": "www.shayudong.website", "custom_domain": true }
]
```

然后重新部署 Worker。

## 配置文件

Workers 部署配置文件：

```text
wrangler.worker.jsonc
```

当前关键配置：

```jsonc
{
  "name": "erick-resume-worker",
  "main": "dist/server/index.js",
  "workers_dev": true,
  "preview_urls": true,
  "compatibility_date": "2026-05-15",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "dist/client"
  },
  "observability": {
    "enabled": true
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

## 绑定 `shayudong.website` 的操作顺序

1. 进入 Cloudflare Dashboard。
2. 选择 `Websites` / `Add a domain or site`。
3. 输入：

   ```text
   shayudong.website
   ```

4. 选择 Free 计划即可，简历网站访问量不大，前期不需要付费计划。
5. Cloudflare 会给出两条 nameserver，例如：

   ```text
   xxx.ns.cloudflare.com
   yyy.ns.cloudflare.com
   ```

6. 进入阿里云域名控制台，找到 `shayudong.website`。
7. 修改 DNS 服务器，把原来的：

   ```text
   dns1.hichina.com
   dns2.hichina.com
   ```

   替换成 Cloudflare 给出的两条 nameserver。

8. 等待 Cloudflare 显示域名状态为 `Active`。
9. 再绑定 Worker 自定义域名并重新部署。

## 如果 Cloudflare 移动端访问仍然不稳定

如果 `shayudong.website` 绑定 Cloudflare 后，手机端或国内网络仍然加载失败，建议切换到国内服务器部署。

低成本推荐：

- 阿里云轻量应用服务器或 ECS。
- Ubuntu 22.04 / 24.04。
- 2 vCPU / 2 GB RAM。
- 40 GB ESSD。
- 3 Mbps 到 5 Mbps 带宽。
- 使用 Docker + Caddy 或 Nginx 部署。

如果后续要长期作为求职简历入口，国内服务器访问稳定性通常优于 Cloudflare，尤其是面试官使用手机扫码访问时。
