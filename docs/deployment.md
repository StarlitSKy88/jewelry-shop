# 部署指南

## 环境准备

### 系统要求
- Node.js >= 16
- MySQL >= 8.0
- Redis >= 6.0
- Nginx >= 1.18

### 服务器配置建议
- CPU: 4核心
- 内存: 8GB
- 磁盘: 50GB SSD
- 操作系统: Ubuntu 20.04 LTS

## 部署步骤

### 1. 安装依赖

```bash
# 更新系统包
sudo apt update
sudo apt upgrade

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 MySQL
sudo apt install -y mysql-server

# 安装 Redis
sudo apt install -y redis-server

# 安装 Nginx
sudo apt install -y nginx
```

### 2. 配置数据库

```bash
# 登录 MySQL
sudo mysql

# 创建数据库和用户
CREATE DATABASE your_database;
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_database.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 配置环境变量

```bash
# 复制环境配置模板
cp .env.example .env

# 编辑环境配置
nano .env
```

配置以下必要的环境变量：
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `API_KEY`
- `NODE_ENV=production`

### 4. 构建应��

```bash
# 安装依赖
npm install
cd client && npm install
cd ../server && npm install

# 构建前端
cd ../client && npm run build

# 构建后端
cd ../server && npm run build
```

### 5. 配置 Nginx

创建 Nginx 配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/client/build;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. 配置进程管理

使用 PM2 管理 Node.js 进程：

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
cd server
pm2 start dist/server.js --name "api-server"

# 设置开机自启
pm2 startup
pm2 save
```

### 7. 配置 SSL（可选）

使用 Certbot 配置 HTTPS：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

### 8. 监控设置

1. 配置日志收集：
```bash
# 创建日志目录
mkdir -p /var/log/your-app
chmod 755 /var/log/your-app
```

2. 配��性能监控：
- 在管理后台启用性能监控
- 设置告警阈值
- 配置通知方式

## 维护指南

### 日常维护
1. 日志轮转
2. 数据库备份
3. 性能监控
4. 安全更新

### 故障处理
1. 检查日志文件
2. 检查系统资源
3. 检查服务状态
4. 回滚部署

### 更新流程
1. 备份数据
2. 拉取新代码
3. 安装依赖
4. 构建应用
5. 重启服务

## 安全建议

1. 防火墙配置
2. 定期更新系统
3. 使用强密码
4. 启用 HTTPS
5. 限制访问权限

## 性能优化

1. 启用 Nginx 缓存
2. 优化数据库查询
3. 使用 CDN
4. 开启 Gzip 压缩
5. 配置合理的缓存策略 