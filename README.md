# 珠宝商城系统

## 在线测试平台

- 前端测试地址：`http://localhost:3000`
- 后端API地址：`http://localhost:3001`
- 数据库：本地MySQL

### 测试账号
- 普通用户：
  - 邮箱：test@example.com
  - 密码：123456
- 管理员：
  - 邮箱：admin@example.com
  - 密码：admin123

## 已实现功能

### 用户系统
- [x] 用户注册
- [x] 用户登录
- [x] 个人信息管理
- [x] 密码修改
- [x] 权限控制

### 商品系统
- [x] 商品分类展示
- [x] 商品列表
- [x] 商品详情
- [x] 商品搜索
- [x] 商品筛选
- [x] 商品排序

### 购物车系统
- [x] 添加商品到购物车
- [x] 购物车商品管理
- [x] 购物车结算
- [x] 商品数量修改
- [x] 商品删除

### 订单系统
- [x] 订单创建
- [x] 订单支付
- [x] 订单状态跟踪
- [x] 订单历史记录
- [x] 订单详情查看

### 收藏系统
- [x] 商品收藏
- [x] 收藏列表管理
- [x] 收藏商品查看

### 评价系统
- [x] 商品评价
- [x] 评价管理
- [x] 评分系统

### 地址管理
- [x] 收货地址添加
- [x] 收货地址编辑
- [x] 收货地址删除
- [x] 默认地址设置

### UI/UX
- [x] 响应式设计
- [x] 页面动画效果
- [x] 加载状态展示
- [x] 错误处理提示
- [x] 操作反馈

## 技术栈

### 前端
- React 18
- TypeScript
- Redux Toolkit
- Material-UI
- Vite

### 后端
- Node.js
- Express
- MySQL
- JWT认证

### 开发工具
- Git
- ESLint
- Jest
- Docker

## 本地开发环境搭建

1. 克隆项目
```bash
git clone [repository-url]
cd jewelry-shop
```

2. 安装依赖
```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

3. 配置环境变量
```bash
# 后端配置
cd server
cp .env.example .env

# 前端配置
cd ../client
cp .env.example .env
```

4. 配置数据库
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE jewelry_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入数据库结构
mysql -u root -p jewelry_shop < server/src/database/schema.sql
```

5. 启动开发服务器
```bash
# 启动后端服务器
cd server
npm run dev

# 启动前端开发服务器
cd ../client
npm run dev
```

## 测试

### 运行测试
```bash
# 运行前端测试
cd client
npm test

# 运行后端测试
cd server
npm test
```

## API文档
API文档使用Swagger生成，开发环境访问地址：
```
http://localhost:3001/api-docs
```

## 性能指标
- 首次加载时间 < 2s
- 页面切换时间 < 300ms
- API响应时间 < 500ms
- 页面性能分数 > 90

## 错误监控
- 前端错误日志
- 后端错误日志
- API请求日志
- 性能监控

## 安全措施
- JWT认证
- 密码加密
- XSS防护
- CSRF防护
- SQL注入防护
- 请求限流

## 部署说明
1. 确保服务器已安装：
   - Node.js >= 16.0.0
   - MySQL >= 8.0
   - npm >= 8.0.0

2. 配置环境变量
3. 构建前端代码
4. 启动后端服务
5. 配置反向代理

## 维护说明
- 定期数据库备份
- 日志清理
- 性能监控
- 错误追踪
- 安全更新

## 联系方式
如有问题或建议，请提交Issue或联系项目维护者。