# 信息分享App管理员系统

基于Vue 3 + TypeScript + Express的信息分享App管理员后台系统，用于管理员审核专业人士申请和管理普通用户。

## 技术栈

### 前端

- Vue 3 + TypeScript + Vite
- Pinia 状态管理
- Vue Router 路由管理
- Element Plus UI组件库
- Axios 网络请求

### 后端

- Node.js + Express
- TypeScript
- MongoDB (与小程序共用数据库)
- JWT认证

### 工具和部署

- pnpm 包管理
- Docker 容器化
- Docker Compose 多容器编排

## 主要功能

### 管理员功能

1. 登录/登出
2. 仪表盘统计数据
3. 专业人士管理
   - 列表查看所有专业人士
   - 审核专业人士申请
   - 查看详情/编辑信息
   - 禁用/启用账号
4. 用户管理
   - 列表查看所有用户
   - 查看用户详情
   - 禁用/启用账号
5. 预约管理
   - 查看所有预约记录
   - 筛选和搜索预约
   - 查看预约详情
6. 系统设置
   - 管理员账号管理
   - 系统参数配置

## 开发指南

### 环境要求

- Node.js 18+
- pnpm 8+
- Docker和Docker Compose (用于生产环境部署)

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动前端和后端开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### Docker部署

```bash
# 构建Docker镜像
pnpm docker:build

# 启动Docker容器
pnpm docker:up

# 停止Docker容器
pnpm docker:down
```

## 目录结构

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
