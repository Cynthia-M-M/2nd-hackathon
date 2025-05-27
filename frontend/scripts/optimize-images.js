import sharp from 'sharp'
import { readdir } from 'fs/promises'
import { join } from 'path'
import process from 'node:process'

const SIZES = [
  { width: 128, suffix: 'sm' },
  { width: 160, suffix: 'md' },
  { width: 256, suffix: 'lg' }
]

async function optimizeImages() {
  try {
    const assetsDir = join(process.cwd(), 'src/assets')
    const files = await readdir(assetsDir)
    
    for (const file of files) {
      if (!file.match(/\.(png|jpe?g)$/i)) continue
      
      const filePath = join(assetsDir, file)
      const fileName = file.replace(/\.[^.]+$/, '')
      
      // Create WebP versions
      for (const { width, suffix } of SIZES) {
        await sharp(filePath)
          .resize(width, null, { 
            withoutEnlargement: true,
            fit: 'contain'
          })
          .webp({ quality: 80 })
          .toFile(join(assetsDir, `${fileName}-${suffix}.webp`))
      }
      
      // Create fallback PNG versions
      for (const { width, suffix } of SIZES) {
        await sharp(filePath)
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'contain'
          })
          .png({ quality: 80 })
          .toFile(join(assetsDir, `${fileName}-${suffix}.png`))
      }
    }
    
    console.log('✨ Images optimized successfully!')
  } catch (error) {
    console.error('Error optimizing images:', error)
    process.exit(1)
  }
}

optimizeImages() 