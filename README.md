# 信息分享应用 (InfoShare App)

这是一个基于微信小程序和Web管理系统的信息分享平台，旨在连接专业人士和需要服务的用户。用户可以浏览专业人士列表，查看详情，并进行预约。专业人士可以注册并提供专业服务。管理员可以通过Web管理系统对用户、专业人士和预约进行管理。

## 项目架构

项目由两部分组成：

1. **微信小程序前端**：用户和专业人士使用的移动端应用
2. **Web管理系统**：管理员使用的后台管理系统

## 微信小程序

微信小程序前端使用原生微信小程序开发框架，结合云开发能力构建。

### 功能特点

- **用户端**：

  - 浏览专业人士列表
  - 查看专业人士详情
  - 预约服务
  - 管理自己的预约
  - 个人中心管理

- **专业人士端**：
  - 专业人士注册与资质提交
  - 设置服务时间和价格
  - 查看和管理预约
  - 个人主页管理

### 技术栈

- 微信小程序原生开发框架
- 微信云开发（数据库、云函数、存储）
- WXML/WXSS/JavaScript

## 管理系统 (Admin System)

管理系统是一个基于Web的应用，用于管理整个平台的数据和用户。

### 功能特点

- **仪表盘**：

  - 数据统计和可视化
  - 系统运行状态监控

- **专业人士管理**：

  - 查看专业人士列表
  - 审核专业人士申请
  - 启用/禁用专业人士账号

- **用户管理**：

  - 查看用户列表
  - 用户详情和操作日志
  - 管理用户状态

- **预约管理**：

  - 查看全部预约记录
  - 处理特殊预约情况
  - 预约统计

- **系统设置**：
  - 管理员账号管理
  - 个人设置
  - 系统参数配置

### 技术栈

- **前端**：

  - Vue 3
  - TypeScript
  - Element Plus UI库
  - Vite构建工具
  - Vue Router
  - Pinia状态管理

- **后端**：
  - Node.js + Express
  - TypeScript
  - 直接连接微信云开发数据库
  - JWT认证

## 环境变量配置

### 微信小程序

微信小程序需要配置以下信息：

- 微信AppID：在微信开发者工具中填写
- 云开发环境ID：在`project.config.json`中配置

### 管理系统

管理系统需要在`.env`文件中配置以下环境变量：

#### 基础配置

```
# 服务器配置
PORT=3000                          # 后端服务器端口号

# 腾讯云开发配置
CLOUD_ENV=your-env-id             # 微信云开发环境ID
SECRETID=your-secret-id           # 腾讯云API的SecretID
SECRETKEY=your-secret-key         # 腾讯云API的SecretKey

# JWT配置
JWT_SECRET=your-jwt-secret        # JWT密钥，用于token加密
JWT_EXPIRES_IN=24h                # JWT过期时间

# 初始管理员账号配置
ADMIN_USERNAME=admin              # 初始管理员用户名
ADMIN_PASSWORD=yourpassword       # 初始管理员密码(至少6位)
ADMIN_NAME=管理员                 # 管理员显示名称
```

获取腾讯云开发配置：

1. 登录[腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入【云开发】-【环境】，复制环境ID作为`CLOUD_ENV`
3. 进入【访问管理】-【API密钥管理】，创建或查看SecretID和SecretKey

## 安装和运行

### 微信小程序

1. 使用微信开发者工具打开项目
2. 填写自己的AppID
3. 开启云开发功能
4. 部署云函数

### 管理系统

#### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- 微信云开发环境ID和密钥
- Docker和Docker Compose (用于生产环境部署，可选)

#### 目录结构

```
admin-system/
├── frontend/               # 前端Vue项目
│   ├── src/
│   │   ├── api/            # API调用
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 组件
│   │   ├── router/         # 路由
│   │   ├── stores/         # Pinia存储
│   │   ├── views/          # 页面
│   │   └── App.vue         # 根组件
│   ├── package.json
│   └── vite.config.ts
├── backend/                # 后端Express项目
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── middlewares/    # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 服务
│   │   └── app.ts          # 应用入口
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml      # Docker编排
├── Dockerfile.frontend     # 前端Docker配置
├── Dockerfile.backend      # 后端Docker配置
└── pnpm-workspace.yaml     # pnpm工作区配置
```

#### 本地开发

1. 安装依赖：

```bash
cd admin-system
pnpm install
```

2. 配置环境变量：

```bash
cd backend
cp .env.example .env
# 编辑.env文件，填写必要配置：
# - 服务器端口
# - 微信云开发环境ID、SecretID、SecretKey
# - JWT密钥和过期时间
# - 初始管理员账号信息
```

3. 启动开发服务器（同时启动前端和后端）：

```bash
cd admin-system
pnpm dev
```

或分别启动：

```bash
# 启动前端
cd admin-system/frontend
pnpm dev

# 启动后端
cd admin-system/backend
pnpm dev
```

4. 访问管理系统：
   - 前端：http://localhost:5173
   - 后端：http://localhost:3000
   - 默认管理员账号：admin，密码：看.env文件配置

## 部署

### 微信小程序

通过微信小程序开发者工具上传代码并提交审核。

### 管理系统

#### 方法一：常规部署

1. 构建前端：

```bash
cd admin-system/frontend
pnpm build
```

2. 构建后端：

```bash
cd admin-system/backend
pnpm build
```

3. 部署前端静态文件到Web服务器（如Nginx）
4. 使用PM2等工具运行后端服务

#### 方法二：Docker部署

```bash
# 构建Docker镜像并启动
cd admin-system
docker-compose up -d

# 停止Docker容器
docker-compose down
```

或使用pnpm脚本（如已配置）：

```bash
# 构建Docker镜像
pnpm docker:build

# 启动Docker容器
pnpm docker:up

# 停止Docker容器
pnpm docker:down
```

## 开发团队

- 产品设计：[产品团队]
- 前端开发：[前端团队]
- 后端开发：[后端团队]
- 项目管理：[项目团队]

## 许可证

[版权所有] © 2023-2024 信息分享App团队，保留所有权利

## TODO List

### Bug Fixes

- **TimeSchedule组件月份切换问题**: TimeSchedule.vue组件中的月份切换功能（前进/后退按钮）在切换月份时存在兼容性问题，需要修复以确保日期选择在90天范围内正常工作。当前尝试通过以下方法未能解决：
  - 改变@tap为@click事件
  - 替换picker组件为简化的月份显示
  - 调整日期计算和格式化方法
  - 直接修改currentDate变量

### Features

- 完善全局样式和主题
- 优化移动端适配
