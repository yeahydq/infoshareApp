import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { createCanvas, loadImage } from 'canvas'

// 确保输出目录存在
const outputDir = path.join(__dirname, '../src/static/image')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 生成轮播图
function generateBanner(index) {
  const canvas = createCanvas(750, 360)
  const ctx = canvas.getContext('2d')

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#4a90e2')
  gradient.addColorStop(1, '#2c3e50')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 添加文字
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(index === 1 ? '家教预约' : '暑期特惠', canvas.width / 2, canvas.height / 2 - 20)

  ctx.font = '24px Arial'
  ctx.fillText(
    index === 1 ? '小程序上线了' : '名师课程8折起',
    canvas.width / 2,
    canvas.height / 2 + 20,
  )

  // 保存图片
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(outputDir, `banner${index}.png`), buffer)
}

// 生成分类图标
function generateCategoryIcon(name, color) {
  const canvas = createCanvas(100, 100)
  const ctx = canvas.getContext('2d')

  // 绘制圆形背景
  ctx.beginPath()
  ctx.arc(50, 50, 45, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()

  // 添加文字
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name.charAt(0), 50, 50)

  // 保存图片
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(outputDir, `${name.toLowerCase()}.png`), buffer)
}

// 生成教师头像
function generateTeacherAvatar(index) {
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')

  // 绘制圆形背景
  ctx.beginPath()
  ctx.arc(100, 100, 90, 0, Math.PI * 2)
  ctx.fillStyle = '#e0e0e0'
  ctx.fill()

  // 添加文字
  ctx.fillStyle = '#666666'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`T${index}`, 100, 100)

  // 保存图片
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(outputDir, `teacher${index}.png`), buffer)
}

// 生成服务卡片背景
function generateServiceCard(type) {
  const canvas = createCanvas(400, 200)
  const ctx = canvas.getContext('2d')

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  if (type === 'online') {
    gradient.addColorStop(0, '#ff9a9e')
    gradient.addColorStop(1, '#fad0c4')
  } else {
    gradient.addColorStop(0, '#a8edea')
    gradient.addColorStop(1, '#fed6e3')
  }
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 添加装饰图案
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 30 + 10,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  // 保存图片
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(outputDir, `${type}-teaching.png`), buffer)
}

// 生成所有图片
function generateAllImages() {
  // 生成轮播图
  generateBanner(1)
  generateBanner(2)

  // 生成分类图标
  const categories = [
    { name: 'management', color: '#4a8af4' },
    { name: 'medicine', color: '#5bbdca' },
    { name: 'agriculture', color: '#9b7cf6' },
    { name: 'engineering', color: '#f47a7a' },
    { name: 'science', color: '#5ed3b9' },
    { name: 'history', color: '#9b7cf6' },
    { name: 'literature', color: '#f47a7a' },
    { name: 'more', color: '#5bbdca' },
  ]

  categories.forEach((category) => {
    generateCategoryIcon(category.name, category.color)
  })

  // 生成教师头像
  for (let i = 1; i <= 3; i++) {
    generateTeacherAvatar(i)
  }

  // 生成服务卡片背景
  generateServiceCard('online')
  generateServiceCard('in-person')

  console.log('所有图片生成完成！')
}

// 运行生成函数
generateAllImages()
