# 阿里云服务器实际部署记录

当前网站已部署到阿里云 Ubuntu 22.04.5 LTS 服务器。

服务器：

```text
118.190.155.166
```

当前访问地址：

```text
http://118.190.155.166
```

## 实际运行方式

由于服务器拉取 DockerHub 官方 Node 镜像超时，当前没有使用 Cloudflare Pages 静态部署，也没有依赖 Docker 镜像运行。

当前采用：

```text
Nginx 80 端口
  ↓
systemd 常驻 Node / Vinext 生产服务
  ↓
127.0.0.1:3000
```

这仍然是当前网站的动态 Vinext 生产版本，保留 Galaxy 背景、鼠标交互、图片组件和页面动画效果。

## 服务器目录

```text
/opt/shayudong-resume/current
```

`current` 是当前生效版本的软链接，实际版本目录位于：

```text
/opt/shayudong-resume/releases/
```

## systemd 服务

服务名称：

```text
shayudong-resume.service
```

常用命令：

```bash
systemctl status shayudong-resume
systemctl restart shayudong-resume
journalctl -u shayudong-resume -f
```

## Nginx

配置文件：

```text
/etc/nginx/sites-available/shayudong-resume
```

已配置域名：

```text
shayudong.website
www.shayudong.website
118.190.155.166
```

当前 Nginx 监听 80 端口，并反向代理到：

```text
http://127.0.0.1:3000
```

## 域名解析

在阿里云 DNS 中添加：

```text
主机记录：@
记录类型：A
记录值：118.190.155.166
```

```text
主机记录：www
记录类型：A
记录值：118.190.155.166
```

解析生效后，访问：

```text
http://shayudong.website
http://www.shayudong.website
```

## HTTPS

域名 A 记录生效后，再使用 Certbot 或 Caddy 配置 HTTPS。

建议后续命令：

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d shayudong.website -d www.shayudong.website
```

证书签发前必须保证：

- 域名已经解析到 `118.190.155.166`。
- 阿里云安全组已放行 80 和 443。
- `http://shayudong.website` 已经能正常访问。
