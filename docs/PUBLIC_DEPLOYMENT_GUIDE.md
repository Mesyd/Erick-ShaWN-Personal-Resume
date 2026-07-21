# 个人简历网站公网部署建议

目标：低成本、稳定、能让 HR 通过一个简洁域名访问个人简历网站。

## 推荐路线

### 路线 A：继续使用当前 OpenAI Sites

适合：想最快上线，不想折腾服务器。

优点：

- 当前网站已经在 OpenAI Sites 上部署。
- 当前访问权限已切换为 public，HR 可以通过现有链接访问。
- 不需要自己维护服务器。

注意：

- 是否绑定自定义域名，要以后根据 Sites 支持情况处理。

### 路线 B：Cloudflare Pages / Workers

适合：想用自己的域名，访问量小，希望成本低。

Cloudflare Pages 可以用于简历网站，尤其适合静态站点或轻量前端站点。  
但当前项目使用 Vinext / Worker 兼容构建，不是标准静态导出项目。更稳妥的方向是：

- 如果保持当前技术栈：优先评估 Cloudflare Workers 部署。
- 如果想用 Cloudflare Pages：可以把项目改造成静态导出版本，再使用 Pages 托管。

Cloudflare Pages 的低成本优势：

- 免费计划通常足够个人简历网站使用。
- 支持自定义域名。
- 支持 GitHub / GitLab 自动部署。
- 有预览部署和回滚能力。

### 路线 C：阿里云轻量服务器 / OSS + CDN

适合：一定要使用中国内地服务器、希望国内访问速度更稳定。

注意：

- 解析到中国内地服务器通常需要 ICP 备案。
- 备案流程需要时间，且域名实名认证信息要匹配备案主体。
- 对个人简历网站而言，运维成本和流程复杂度比 Cloudflare 更高。

## 域名购买建议

你可以在阿里云购买域名，例如：

- `shayudong.com`
- `shayudong.cn`
- `syd-resume.com`
- `ericksha.com`
- `erick-syd.com`

建议优先选择：

- 短；
- 好读；
- 不容易拼错；
- 适合写在纸质简历或 NFC 卡片中。

## 是否需要备案

判断逻辑：

- 域名解析到中国内地服务器：通常需要 ICP 备案。
- 域名解析到 Cloudflare、Vercel、GitHub Pages 等境外节点：通常不需要中国内地 ICP 备案。
- 在阿里云购买域名本身不等于必须备案，关键看网站服务器/接入位置。

## 推荐执行顺序

1. 先用当前 Sites 公网链接验证投递效果。
2. 购买域名并完成实名认证。
3. 如果使用 Cloudflare：
   - 把域名添加到 Cloudflare；
   - 按 Cloudflare 给出的 NS 记录，到阿里云域名控制台修改 DNS 服务器；
   - 在 Cloudflare Pages/Workers 中绑定自定义域名；
   - 等待 DNS 生效。
4. 如果使用阿里云中国内地服务器：
   - 先完成域名实名认证；
   - 准备 ICP 备案；
   - 备案通过后再解析和上线。

## 我的建议

对个人简历网站，优先选择：

1. 继续使用当前 OpenAI Sites 公网链接，最快验证投递效果；
2. 后续购买域名；
3. 如果需要长期自主管理，再迁移到 Cloudflare Workers 或 Cloudflare Pages。

不建议一开始就购买阿里云服务器做部署。访问量小、页面以展示为主，服务器运维和备案成本不划算。

## 官方参考链接

- Cloudflare Pages 限制与免费计划额度：https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages 自定义域名：https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages Git 自动部署：https://developers.cloudflare.com/pages/get-started/git-integration/
- Cloudflare Workers 价格与免费额度：https://developers.cloudflare.com/workers/platform/pricing/
- 阿里云 ICP 备案流程：https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-application-overview
- 阿里云备案流程 FAQ：https://help.aliyun.com/zh/icp-filing/basic-icp-service/support/for-the-record-process-faq
- 阿里云域名实名认证：https://help.aliyun.com/zh/dws/user-guide/non-generic-domain-name-authentication/
