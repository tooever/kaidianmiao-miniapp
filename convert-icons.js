/**
 * Convert SVG icons to PNG for WeChat Mini Program TabBar
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, 'assets/icons');
const icons = ['home', 'home-active', 'profile', 'profile-active'];

async function convertIcons() {
  for (const icon of icons) {
    const svgPath = path.join(iconsDir, `${icon}.svg`);
    const pngPath = path.join(iconsDir, `${icon}.png`);
    
    try {
      await sharp(svgPath)
        .resize(81, 81)  // WeChat TabBar icon recommended size
        .png()
        .toFile(pngPath);
      console.log(`✓ Converted ${icon}.svg to ${icon}.png`);
    } catch (err) {
      console.error(`✗ Failed to convert ${icon}.svg:`, err.message);
    }
  }
}

convertIcons().then(() => {
  console.log('\nDone!');
});