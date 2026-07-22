# 发布检查清单

本文档用于每次更新个人简历网站前后快速确认。

## 本地修改前

```bash
git status
```

确认当前没有不属于本次修改的文件混在一起。

## 本地验证

```bash
pnpm install
pnpm run build
```

如果更新了项目图片，先生成缩略图：

```bash
python scripts/generate_project_thumbnails.py
pnpm run build
```

## Git 提交

```bash
git status
git add <本次修改文件>
git commit -m "描述本次修改"
```

## 远程备份

```bash
git push gitee main
git push github main
```

## ECS 发布

当前 ECS 采用 Nginx + systemd + Vinext 生产服务。

发布逻辑：

```text
本地当前提交
  ↓
打包源码
  ↓
上传到 /opt/shayudong-resume/releases/<时间戳>
  ↓
服务器安装依赖并构建
  ↓
current 软链接切换到新版本
  ↓
重启 shayudong-resume.service
```

发布后检查：

```bash
systemctl status shayudong-resume
curl -I http://127.0.0.1:3000
curl -I http://118.190.155.166
```

## 域名和 HTTPS

域名备案完成后再处理：

```bash
certbot --nginx -d shayudong.website -d www.shayudong.website
```

HTTPS 配置完成后，优先使用：

```text
https://shayudong.website
```
