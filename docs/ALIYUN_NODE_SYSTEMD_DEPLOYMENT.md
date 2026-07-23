# 阿里云服务器实际部署记录

当前网站已部署到阿里云 Ubuntu 22.04.5 LTS 服务器。

服务器：

```text
118.190.155.166
```

当前访问地址：

```text
https://shayudong.website
https://www.shayudong.website
http://118.190.155.166
```

## 实际运行方式

由于服务器拉取 DockerHub 官方 Node 镜像超时，当前没有使用 Cloudflare Pages 静态部署，也没有依赖 Docker 镜像运行。

当前采用：

```text
Nginx 80 / 443 端口
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

当前 Nginx 监听 80 / 443 端口。域名访问会自动跳转到 HTTPS，并反向代理到：

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

已使用 Certbot + Nginx 完成 HTTPS 配置。

当前证书域名：

```text
shayudong.website
www.shayudong.website
```

证书路径：

```text
/etc/letsencrypt/live/shayudong.website/fullchain.pem
/etc/letsencrypt/live/shayudong.website/privkey.pem
```

Certbot 已安装自动续期定时任务。检查命令：

```bash
certbot certificates
systemctl list-timers | grep certbot
```

当前验证结果：

```text
http://shayudong.website      -> 301 跳转到 https://shayudong.website/
https://shayudong.website     -> 200 OK
https://www.shayudong.website -> 200 OK
```

如果后续更换服务器或重装系统，重新配置 HTTPS 前必须保证：

- 域名已经解析到 `118.190.155.166` 或新的服务器公网 IP。
- 阿里云安全组已放行 80 和 443。
- Nginx 80 端口能正常访问站点。

## 更新 ECS 网站的流程

本地项目是源码仓库，ECS 上运行的是从本地源码打包上传后的生产构建版本。二者不是自动同步关系。

当前更新流程：

```text
本地修改代码
  ↓
本地 build 验证
  ↓
git archive 打包当前提交
  ↓
scp 上传到 ECS /tmp
  ↓
ECS 解压到 /opt/shayudong-resume/releases/新版本
  ↓
ECS pnpm install && pnpm run build
  ↓
current 软链接切换到新版本
  ↓
systemctl restart shayudong-resume
  ↓
Nginx 继续反向代理到 127.0.0.1:3000
```

这样做的好处是：每次线上版本都是一个独立 release 目录，后续如果某个版本有问题，可以把 `current` 软链接切回上一个 release。
