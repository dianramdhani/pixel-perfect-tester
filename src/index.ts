import fs from 'fs';
import { captureScreenshot } from './screenshot';
import { compareImages } from './compare';

async function main() {
  const [, , url, baselinePath] = process.argv;

  if (!url || !baselinePath) {
    console.log('Usage: tsx src/index.ts <url> <baseline.png>');
    process.exit(1);
  }

  console.log(`🌐 Opening ${url} ...`);
  const screenshotPath = await captureScreenshot(url, baselinePath);

  console.log(`🧪 Comparing screenshot with baseline: ${baselinePath}`);
  const result = await compareImages(baselinePath, screenshotPath);

  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/report.json', JSON.stringify(result, null, 2));

  console.log(`
✅ Match: ${result.match}
🧮 Diff Pixels: ${result.diffPixelCount}
📊 Diff Percentage: ${result.diffPercentage.toFixed(3)}%
🖼️  Diff Image: ${result.diffPath}
📄 Report: output/report.json
  `);
}

main();
