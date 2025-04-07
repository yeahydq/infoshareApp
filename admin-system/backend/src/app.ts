import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { config } from 'dotenv'

// 导入路由
import authRoutes from './routes/authRoutes'
import professionalRoutes from './routes/professionalRoutes'
import userRoutes from './routes/userRoutes'
import bookingRoutes from './routes/bookingRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import serviceTypeRoutes from './routes/serviceTypeRoutes'

// 加载环境变量
config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 设置路由
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/professionals', professionalRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/service-types', serviceTypeRoutes)

// 根路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '信息分享App管理员系统API',
    version: '1.0.0',
  })
})

// 404处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    code: 404,
    message: '请求的资源不存在',
  })
})

// 错误处理
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})

export default app
