# 阿里云服务器 Docker 部署说明

推荐服务器系统：

```text
Ubuntu 22.04 LTS 64 位
```

推荐部署结构：

```text
Internet
  ↓
Nginx / Caddy 监听 80 和 443
  ↓
Docker 容器内网站服务，监听 3000
```

当前项目已经增加：

```text
Dockerfile
.dockerignore
docker-compose.yml
```

## 服务器基础软件

需要安装：

- Docker
- Docker Compose Plugin 或 `docker-compose`
- Nginx 或 Caddy

## 容器启动

在服务器项目目录执行：

```bash
docker compose up -d --build
```

如果服务器安装的是 Ubuntu 源里的 Compose v1，使用：

```bash
docker-compose up -d --build
```

容器会监听本机：

```text
http://127.0.0.1:3000
```

如果只做临时测试，也可以直接访问：

```text
http://服务器公网 IP:3000
```

正式使用域名时，建议不要直接暴露 3000 端口，而是用 Nginx 或 Caddy 反向代理到 3000。

## Nginx 反向代理示例

```nginx
server {
    listen 80;
    server_name shayudong.website www.shayudong.website;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 域名解析

在阿里云 DNS 中添加：

```text
主机记录：@
记录类型：A
记录值：服务器公网 IP
```

```text
主机记录：www
记录类型：A
记录值：服务器公网 IP
```

DNS 生效后，访问：

```text
http://shayudong.website
http://www.shayudong.website
```

HTTPS 可以后续用 Certbot 或 Caddy 自动签发。
