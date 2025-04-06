# InfoShare 信息分享应用管理系统

## 项目介绍

InfoShare是一个专业人士与用户之间的信息分享和预约管理平台，后台管理系统用于管理用户、专业人士、预约等数据。

## 环境要求

- Node.js 14.x 或更高版本
- NPM 6.x 或更高版本
- 腾讯云账号和云开发环境（使用模拟数据库时可选）

## 环境配置

1. 克隆项目并安装依赖

```bash
git clone [项目地址]
cd infoshareApp
npm install
```

2. 配置环境变量
   在根目录创建`.env`文件，添加以下配置：

```
# 数据库配置
USE_MOCK_DB=true  # 设置为true使用模拟数据库，无需云环境

# 云开发配置 - 使用云数据库时必填
CLOUD_ENV=你的云环境ID
SECRETID=你的腾讯云SecretID
SECRETKEY=你的腾讯云SecretKey

# 管理员初始账号
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123456
ADMIN_NAME=系统管理员
```

## 使用模式

### 模拟数据库模式

系统默认提供了模拟数据库模式，可以在没有腾讯云环境的情况下进行开发和测试：

1. 确保`.env`文件中`USE_MOCK_DB=true`
2. 使用默认的模拟数据进行开发和测试
3. 默认管理员账号：admin，密码：admin123456

### 云数据库模式

如需使用腾讯云数据库存储真实数据：

1. 在腾讯云创建云开发环境并获取环境ID
2. 获取腾讯云API密钥（SecretID和SecretKey）
3. 在`.env`文件中设置`USE_MOCK_DB=false`并填写正确的云环境信息
4. 运行初始化脚本创建数据库结构

## 数据库初始化

系统提供了两个脚本用于初始化数据库和添加模拟测试数据：

### 初始化数据库

初始化数据库会创建必要的集合和管理员账号：

```bash
# 方式1：使用npm脚本
cd admin-system/backend
pnpm run init-db

# 方式2：直接运行ts-node
npx ts-node src/scripts/initDatabase.ts
```

> 注意：如果遇到 `sh: ts-node: command not found` 错误，请确保已经安装了ts-node，可以通过以下命令安装：
>
> ```bash
> npm install -g ts-node typescript
> # 或者使用npx方式运行（不需要全局安装）
> npx ts-node src/scripts/initDatabase.ts
> ```

### 添加模拟数据

添加模拟数据会创建测试用的用户、专业人士和预约数据：

```bash
# 方式1：使用npm脚本
npm run add-mock-data

# 方式2：直接运行ts-node
npx ts-node src/scripts/addMockData.ts
```

## 启动应用

### 后端服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run start
```

### 前端应用（位于admin-system/frontend目录）

```bash
cd admin-system/frontend
npm install
npm run dev
```

## 登录信息

初始化后，可使用以下默认管理员账号登录：

- 用户名：admin
- 密码：admin123456

## 常见问题排查

1. **ts-node: command not found**
   解决方案：使用npx运行命令：`npx ts-node src/scripts/initDatabase.ts`

2. **env not exists 错误**

   - 检查`.env`文件中的云环境ID是否正确
   - 确认云环境是否已创建并启用
   - 临时解决方案：设置`USE_MOCK_DB=true`使用模拟数据库

3. **数据库连接失败**

   - 检查`.env`文件中的云环境ID、SecretID和SecretKey是否正确
   - 确认云环境是否开通并启用
   - 检查IP白名单设置
   - 如果继续失败，可切换到模拟数据库模式

4. **初始化成功但无法登录**
   - 检查前端API请求地址是否正确
   - 检查浏览器控制台和服务器日志查找具体错误
