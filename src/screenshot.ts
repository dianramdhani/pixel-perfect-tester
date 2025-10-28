import puppeteer from 'puppeteer';
import fs from 'fs';
import { PNG } from 'pngjs';

export async function captureScreenshot(
  url: string,
  baselinePath: string,
  outputPath = 'output/screenshot.png',
): Promise<string> {
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const { width, height } = baseline;

  fs.mkdirSync('output', { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.addStyleTag({
    content: `
      * { transition: none !important; animation: none !important; }
      html, body { scroll-behavior: auto !important; }
    `,
  });

  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();

  return outputPath;
}
