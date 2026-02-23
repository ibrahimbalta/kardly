// PWA Icon Generator Script
// Generates PNG icons from SVG for PWA manifest
// Run: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG icon template - Kardly logo (coral pink card icon)
const generateSVG = (size, padding = 0) => {
    const p = padding;
    const s = size;
    const innerSize = s - p * 2;
    const cx = s / 2;
    const cy = s / 2;

    // Card icon dimensions relative to inner size
    const cardW = innerSize * 0.42;
    const cardH = innerSize * 0.52;
    const cardX = cx - cardW / 2;
    const cardY = cy - cardH / 2 + innerSize * 0.02;
    const cardR = innerSize * 0.04;

    // Small window/color block on the card
    const blockW = cardW * 0.35;
    const blockH = cardH * 0.22;
    const blockX = cardX + cardW * 0.14;
    const blockY = cardY + cardH * 0.18;
    const blockR = innerSize * 0.02;

    // Line elements on card
    const lineY1 = cardY + cardH * 0.58;
    const lineY2 = cardY + cardH * 0.72;
    const lineX = cardX + cardW * 0.14;
    const lineW1 = cardW * 0.72;
    const lineW2 = cardW * 0.50;
    const lineH = innerSize * 0.022;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF4D7D"/>
      <stop offset="100%" style="stop-color:#FF3060"/>
    </linearGradient>
    <linearGradient id="block" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A1A2E"/>
      <stop offset="100%" style="stop-color:#16213E"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect x="${p}" y="${p}" width="${innerSize}" height="${innerSize}" rx="${innerSize * 0.22}" fill="url(#bg)"/>
  <!-- Card shape -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}" fill="white" opacity="0.95"/>
  <!-- Color block -->
  <rect x="${blockX}" y="${blockY}" width="${blockW}" height="${blockH}" rx="${blockR}" fill="url(#block)"/>
  <!-- Text lines -->
  <rect x="${lineX}" y="${lineY1}" width="${lineW1}" height="${lineH}" rx="${lineH / 2}" fill="#FF3060" opacity="0.25"/>
  <rect x="${lineX}" y="${lineY2}" width="${lineW2}" height="${lineH}" rx="${lineH / 2}" fill="#FF3060" opacity="0.15"/>
</svg>`;
};

// Generate maskable SVG (with safe zone padding)
const generateMaskableSVG = (size) => {
    const padding = size * 0.1; // 10% safe zone
    return generateSVG(size, padding);
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Write SVG files (they can be used directly or converted to PNG)
sizes.forEach(size => {
    const svg = generateSVG(size);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
    console.log(`✅ Generated icon-${size}x${size}.svg`);
});

// Maskable icons
[192, 512].forEach(size => {
    const svg = generateMaskableSVG(size);
    fs.writeFileSync(path.join(iconsDir, `icon-maskable-${size}x${size}.svg`), svg);
    console.log(`✅ Generated icon-maskable-${size}x${size}.svg`);
});

// Also generate a simple favicon SVG
const faviconSVG = generateSVG(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSVG);
console.log('✅ Generated favicon.svg');

console.log('\n🎉 All icons generated!');
console.log('📌 Note: For best results, convert SVG to PNG using a tool like sharp or an online converter.');
console.log('   The manifest.json references .png files. SVG icons work in modern browsers.');
