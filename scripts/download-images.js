import fs from 'fs'
import path from 'path'
import axios from 'axios'

// 确保输出目录存在
const outputDir = path.join(__dirname, '../src/static/image')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 下载图片的函数
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    }

    axios
      .get(url, options)
      .then((response) => {
        if (response.status === 302 || response.status === 301) {
          // 处理重定向
          const redirectUrl = response.headers.location
          axios.get(redirectUrl, options).then((redirectResponse) => {
            if (redirectResponse.status === 200) {
              redirectResponse.data
                .pipe(fs.createWriteStream(path.join(outputDir, filename)))
                .on('error', reject)
                .once('close', () => resolve(filename))
            } else {
              redirectResponse.data.resume()
              reject(new Error(`Request Failed With a Status Code: ${redirectResponse.status}`))
            }
          })
        } else if (response.status === 200) {
          response.data
            .pipe(fs.createWriteStream(path.join(outputDir, filename)))
            .on('error', reject)
            .once('close', () => resolve(filename))
        } else {
          response.data.resume()
          reject(new Error(`Request Failed With a Status Code: ${response.status}`))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 要下载的图片列表
const images = [
  { url: 'https://picsum.photos/750/360', filename: 'banner1.png' },
  { url: 'https://picsum.photos/750/360', filename: 'banner2.png' },
  { url: 'https://picsum.photos/100/100', filename: 'management.png' },
  { url: 'https://picsum.photos/100/100', filename: 'medicine.png' },
  { url: 'https://picsum.photos/100/100', filename: 'agriculture.png' },
  { url: 'https://picsum.photos/100/100', filename: 'engineering.png' },
  { url: 'https://picsum.photos/100/100', filename: 'science.png' },
  { url: 'https://picsum.photos/100/100', filename: 'history.png' },
  { url: 'https://picsum.photos/100/100', filename: 'literature.png' },
  { url: 'https://picsum.photos/100/100', filename: 'more.png' },
  { url: 'https://picsum.photos/200/200', filename: 'teacher1.png' },
  { url: 'https://picsum.photos/200/200', filename: 'teacher2.png' },
  { url: 'https://picsum.photos/200/200', filename: 'teacher3.png' },
  { url: 'https://picsum.photos/400/200', filename: 'online-teaching.png' },
  { url: 'https://picsum.photos/400/200', filename: 'in-person-teaching.png' },
]

// 下载所有图片
async function downloadAllImages() {
  console.log('开始下载图片...')
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename)
      console.log(`成功下载: ${image.filename}`)
    } catch (error) {
      console.error(`下载失败 ${image.filename}:`, error.message)
    }
  }
  console.log('所有图片下载完成！')
}

// 运行下载函数
downloadAllImages()
