const fs = require('fs');
const path = require('path');

// Simple SVG icon generator for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const primaryColor = '#ef4444'; // Red theme
const backgroundColor = '#ffffff';

function generateIconSVG(size) {
  const padding = size * 0.15;
  const letterSize = size * 0.5;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="50%" 
    font-family="system-ui, -apple-system, sans-serif" 
    font-size="${letterSize}" 
    font-weight="bold"
    fill="${backgroundColor}" 
    text-anchor="middle" 
    dominant-baseline="central">D</text>
</svg>`;
}

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate all icon sizes
sizes.forEach(size => {
  const svg = generateIconSVG(size);
  const filename = `icon-${size}.png`;
  const svgFilename = `icon-${size}.svg`;
  
  // Save as SVG (can be converted to PNG using online tools or sharp library)
  fs.writeFileSync(
    path.join(publicDir, svgFilename),
    svg
  );
  
  console.log(`Generated ${svgFilename}`);
});

// Generate favicon.ico (as SVG placeholder)
const faviconSVG = generateIconSVG(32);
fs.writeFileSync(
  path.join(publicDir, 'favicon.svg'),
  faviconSVG
);

console.log('\n✅ All icon SVGs generated!');
console.log('\n📝 Next steps:');
console.log('1. Convert SVG files to PNG using:');
console.log('   - Online: https://svgtopng.com or https://cloudconvert.com');
console.log('   - CLI: npm install -g sharp-cli && sharp input.svg -o output.png');
console.log('2. Or use this quick online batch converter:');
console.log('   - Upload all SVGs to https://svgtopng.com');
console.log('   - Download as PNG files');
console.log('3. Replace the .svg files with .png versions in /public');
console.log('\n🎨 Icon style: Red gradient with white "D" letter');
console.log('📐 Sizes generated: ' + sizes.join(', ') + ' pixels');
