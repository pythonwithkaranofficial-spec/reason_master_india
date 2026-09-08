const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const manifestFile = path.join(__dirname, '..', 'src', 'lib', 'assets', 'manifest.ts');

console.log('--- REASONMASTER INDIA ASSET INTEGRITY VALIDATOR ---');

let hasErrors = false;
const checkedPaths = new Set();

// 1. Validate Manifest Entries
const manifestContent = fs.readFileSync(manifestFile, 'utf8');
const srcRegex = /src:\s*["']([^"']+)["']/g;
let match;
const manifestAssets = [];

while ((match = srcRegex.exec(manifestContent)) !== null) {
  manifestAssets.push(match[1]);
}

console.log(`Auditing ${manifestAssets.length} assets declared in manifest.ts...`);

for (const assetPath of manifestAssets) {
  const relativePath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const fullPath = path.join(publicDir, relativePath);
  checkedPaths.add(fullPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`[ERROR] Missing asset declared in manifest: ${assetPath}`);
    hasErrors = true;
  } else {
    const stats = fs.statSync(fullPath);
    if (stats.size === 0) {
      console.error(`[ERROR] Asset file is empty: ${assetPath}`);
      hasErrors = true;
    }
    
    // Validate SVG integrity
    if (assetPath.endsWith('.svg')) {
      const svgContent = fs.readFileSync(fullPath, 'utf8');
      if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
        console.error(`[ERROR] Invalid SVG markup in ${assetPath}`);
        hasErrors = true;
      }
      if (!svgContent.includes('viewBox')) {
        console.warn(`[WARN] SVG missing viewBox: ${assetPath}`);
      }
    }
    
    // Check raster size budget (< 1.5MB)
    if (assetPath.endsWith('.jpg') || assetPath.endsWith('.png') || assetPath.endsWith('.webp')) {
      if (stats.size > 1500 * 1024) {
        console.warn(`[WARN] Raster asset is large (>1.5MB): ${assetPath} (${(stats.size/1024/1024).toFixed(2)} MB)`);
      }
    }
  }
}

// 2. Scan for orphaned files in public/assets
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else {
      if (!checkedPaths.has(full) && !file.endsWith('.json') && !file.endsWith('.ico')) {
        console.info(`[INFO] Public asset found (direct usage or sub-asset): ${path.relative(publicDir, full)}`);
      }
    }
  }
}

scanDir(publicDir);

if (hasErrors) {
  console.error('\n❌ Asset validation FAILED. Please correct errors above.');
  process.exit(1);
} else {
  console.log(`\n✅ Asset validation SUCCESSFUL. All ${manifestAssets.length} manifest assets exist and are valid.`);
  process.exit(0);
}
