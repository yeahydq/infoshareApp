import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const tabbarDir = path.join(__dirname, '../src/static/tabbar')

// Define the icons to convert
const icons = [
  { name: 'home', size: 28 },
  { name: 'home-active', size: 28 },
  { name: 'message', size: 28 },
  { name: 'message-active', size: 28 },
  { name: 'mine', size: 28 },
  { name: 'mine-active', size: 28 },
]

async function convertSvgToPng() {
  for (const icon of icons) {
    const svgPath = path.join(tabbarDir, `${icon.name}.svg`)
    const pngPath = path.join(tabbarDir, `${icon.name}.png`)

    if (fs.existsSync(svgPath)) {
      try {
        await sharp(svgPath).resize(icon.size, icon.size).png().toFile(pngPath)
        console.log(`Converted ${icon.name}.svg to ${icon.name}.png`)
      } catch (error) {
        console.error(`Error converting ${icon.name}.svg:`, error)
      }
    } else {
      console.warn(`Warning: ${icon.name}.svg not found`)
    }
  }
}

convertSvgToPng()
