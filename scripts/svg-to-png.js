const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

async function convertToPng() {
    const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));

    for (const file of files) {
        const svgPath = path.join(iconsDir, file);
        const pngPath = path.join(iconsDir, file.replace('.svg', '.png'));

        // Extract size from filename
        const match = file.match(/(\d+)x(\d+)/);
        const size = match ? parseInt(match[1]) : 512;

        await sharp(svgPath)
            .resize(size, size)
            .png()
            .toFile(pngPath);

        console.log(`✅ ${file} → ${file.replace('.svg', '.png')}`);
    }

    console.log('\n🎉 All PNG icons generated!');
}

convertToPng().catch(console.error);
