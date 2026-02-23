const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Kardly logo SVG - exact match to the provided icon
// Coral-pink rounded square with white outlined card/layout icon
const generateKardlyIcon = (size) => {
  const s = size;
  const bgR = s * 0.22; // background corner radius

  // Card outline dimensions
  const cardW = s * 0.44;
  const cardH = s * 0.40;
  const cardX = s * 0.5 - cardW * 0.5;
  const cardY = s * 0.5 - cardH * 0.5 + s * 0.01;
  const cardR = s * 0.05;
  const strokeW = s * 0.035;

  // Header bar (top section of card)
  const headerH = cardH * 0.30;
  const headerY = cardY;

  // Vertical divider position (left ~38% of card width)
  const dividerX = cardX + cardW * 0.38;
  const dividerTopY = cardY + headerH;
  const dividerBottomY = cardY + cardH;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF2D6A"/>
      <stop offset="50%" style="stop-color:#FF2055"/>
      <stop offset="100%" style="stop-color:#FF1A50"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect x="0" y="0" width="${s}" height="${s}" rx="${bgR}" fill="url(#bg)"/>
  <!-- Card outline -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}" 
        fill="none" stroke="white" stroke-width="${strokeW}" stroke-linejoin="round"/>
  <!-- Header divider line (horizontal) -->
  <line x1="${cardX}" y1="${cardY + headerH}" x2="${cardX + cardW}" y2="${cardY + headerH}" 
        stroke="white" stroke-width="${strokeW}" stroke-linecap="round"/>
  <!-- Vertical divider (left section below header) -->
  <line x1="${dividerX}" y1="${dividerTopY}" x2="${dividerX}" y2="${dividerBottomY}" 
        stroke="white" stroke-width="${strokeW}" stroke-linecap="round"/>
</svg>`;
};

// Maskable version with safe zone padding (10%)
const generateMaskableIcon = (size) => {
  const s = size;
  const padding = s * 0.15;
  const innerS = s - padding * 2;
  const bgR = innerS * 0.22;

  const cardW = innerS * 0.44;
  const cardH = innerS * 0.40;
  const cardX = s * 0.5 - cardW * 0.5;
  const cardY = s * 0.5 - cardH * 0.5 + innerS * 0.01;
  const cardR = innerS * 0.05;
  const strokeW = innerS * 0.035;

  const headerH = cardH * 0.30;
  const dividerX = cardX + cardW * 0.38;
  const dividerTopY = cardY + headerH;
  const dividerBottomY = cardY + cardH;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF2D6A"/>
      <stop offset="50%" style="stop-color:#FF2055"/>
      <stop offset="100%" style="stop-color:#FF1A50"/>
    </linearGradient>
  </defs>
  <!-- Full bleed background for maskable -->
  <rect x="0" y="0" width="${s}" height="${s}" fill="url(#bg2)"/>
  <!-- Card outline -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}" 
        fill="none" stroke="white" stroke-width="${strokeW}" stroke-linejoin="round"/>
  <!-- Header divider line -->
  <line x1="${cardX}" y1="${cardY + headerH}" x2="${cardX + cardW}" y2="${cardY + headerH}" 
        stroke="white" stroke-width="${strokeW}" stroke-linecap="round"/>
  <!-- Vertical divider -->
  <line x1="${dividerX}" y1="${dividerTopY}" x2="${dividerX}" y2="${dividerBottomY}" 
        stroke="white" stroke-width="${strokeW}" stroke-linecap="round"/>
</svg>`;
};

async function generateAllIcons() {
  // Clean existing icons
  const existingFiles = fs.readdirSync(iconsDir);
  existingFiles.forEach(f => {
    fs.unlinkSync(path.join(iconsDir, f));
  });
  console.log('🗑️  Cleaned old icons');

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

  // Generate regular icons
  for (const size of sizes) {
    const svg = generateKardlyIcon(size);
    const svgBuffer = Buffer.from(svg);

    await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));

    console.log(`✅ icon-${size}x${size}.png`);
  }

  // Generate maskable icons
  for (const size of [192, 512]) {
    const svg = generateMaskableIcon(size);
    const svgBuffer = Buffer.from(svg);

    await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(path.join(iconsDir, `icon-maskable-${size}x${size}.png`));

    console.log(`✅ icon-maskable-${size}x${size}.png`);
  }

  // Generate favicon
  const faviconSvg = generateKardlyIcon(32);
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(iconsDir, 'favicon.png'));
  console.log(`✅ favicon.png`);

  // Also generate a 180x180 Apple touch icon
  const appleSvg = generateKardlyIcon(180);
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log(`✅ apple-touch-icon.png`);

  console.log('\n🎉 Tüm ikonlar Kardly logosundan oluşturuldu!');
}

generateAllIcons().catch(console.error);
