import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src/assets');
const files = fs.readdirSync(assetsDir);

async function run() {
  for (const file of files) {
    if (file.endsWith('.jpg')) {
      const inputPath = path.join(assetsDir, file);
      const outputPath = path.join(assetsDir, file.replace('.jpg', '.webp'));
      
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
        
      console.log(`Converted ${file} to WebP`);
      // Remove original jpg if desired
      fs.unlinkSync(inputPath);
    }
  }
}

run().catch(console.error);
