# 海外珠宝首饰独立站

这是一个使用现代技术栈构建的珠宝首饰电商网站。

## 项目特点

- 完整的测试覆盖
  - 单元测试
  - 集成测试
  - E2E测试
- 自动化文档
  - Swagger API文档
  - JSDoc代码文档
- 系统监控
  - Prometheus指标收集
  - 性能监控
  - 错误追踪
- 自动化部署
  - GitHub Actions CI/CD
  - 自动化测试
  - 自动部署到Render

## 技术栈

### 前端
- React.js 18
- Material-UI v5
- React Router v6
- Axios
- Redux Toolkit (状态管理)
- React Query (数据获取)
- Styled-components (样式管理)

### 后端
- Node.js 18+
- Express.js
- MongoDB
- Mongoose
- JWT (认证)
- Multer (文件上传)
- Redis (缓存)
- Jest (测试框架)
- Swagger (API文档)
- Prometheus (监控)

## 功能特点

### 用户体验
- 响应式设计，支持多设备访问
- 性能优化
  - 组件懒加载
  - 图片优化
  - 虚拟滚动
  - 性能监控

### 产品功能
- 产品展示和搜索
  - 产品分类浏览
  - 高级筛选功能
  - 产品详情展示
  - 商品图片轮播
  - 商品规格选择
  - 数量调整
  - 收藏功能
  - 详情标签页展示
- 购物车功能
  - 实时价格计算
  - 商品数量调整
  - 购物车持久化
- 用户系统
  - 用户注册/登录
  - 个人中心
  - 订单管理
  - 收藏夹
- 后台管理系统
  - 商品管理
  - 订单管理
  - 用户管理
  - 数据统计

## 开发状态

### 已完成功能
- [x] 基础框架搭建
- [x] 路由配置
- [x] 状态管理
- [x] 错误处理
- [x] 响应式布局
- [x] 性能优化

### 进行中功能
- [ ] 用户认证系统
- [ ] 购物车功能
- [ ] 订单系统
- [ ] 支付集成

### 测试覆盖
- [x] 单元测试配置
- [x] 组件测试
- [x] 集成测试
- [ ] E2E测试

### 性能指标
- 首次加载时间 < 2s
- 页面切换时间 < 300ms
- 图片加载优化
- 代码分割

## 开发指南

### 目录结构
```
├── client                 # 前端代码
│   ├── public            # 静态资源
│   └── src               # 源代码
│       ├── components    # 公共组件
│       ├── pages         # 页面组件
│       ├── store         # Redux状态管理
│       ├── hooks         # 自定义Hook
│       ├── utils         # 工具函数
│       └── theme         # 主题配置
├── server                # 后端代码
│   ├── controllers      # 控制器
│   ├── models          # 数据模型
│   ├── routes          # 路由
│   ├── middleware      # 中间件
│   ├── tests           # 测试文件
│   ├── monitoring      # 监控配置
│   └── docs            # API文档
└── docs                 # 项目文档
```

### 开发流程

1. 克隆项目并安装依赖
```bash
git clone [repository-url]
cd jewelry-shop

# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

2. 配置环境变量
```bash
# 后端配置
cd server
cp .env.example .env

# 前端配置
cd ../client
cp .env.example .env
```

3. 启动开发服务器
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

# 运行E2E测试
cd client
npm run test:e2e
```

## 部署

### 部署环境
- 前端：GitHub Pages / Vercel
- 后端：Render / Heroku
- 数据库：MongoDB Atlas
- 缓存：Redis Labs
- 文件存储：AWS S3

### 部署步骤
1. 构建前端
```bash
cd client
npm run build
```

2. 部署
```bash
# 前端部署到Vercel
vercel deploy

# 后端部署到Render
git push render main
```

### 部署检查清单
- [ ] 环境变量配置
- [ ] 数据库连接
- [ ] Redis连接
- [ ] 文件存储配置
- [ ] SSL证书
- [ ] 域名配置
- [ ] 性能监控
- [ ] 错误追踪
- [ ] 备份策略

## 环境要求
- Node.js >= 18
- MongoDB >= 5.0
- Redis >= 6.0

## API 文档
API 文档使用 Swagger 生成，开发环境访问地址：
```
http://localhost:3000/api-docs
```

## 贡献指南
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证
MIT

## 联系方式
如有问题或建议，请提交 Issue 或联系项目维护者。