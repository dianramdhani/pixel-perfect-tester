import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export interface CompareResult {
  match: boolean;
  diffPixelCount: number;
  diffPercentage: number;
  diffPath: string;
}

export async function compareImages(
  baselinePath: string,
  actualPath: string,
  outputDiffPath = 'output/diff.png',
): Promise<CompareResult> {
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const actual = PNG.sync.read(fs.readFileSync(actualPath));

  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    throw new Error('Image dimensions do not match');
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });

  const diffPixelCount = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    baseline.width,
    baseline.height,
    {
      threshold: 0.1,
      includeAA: true,
      alpha: 0.8,
      diffColor: [255, 0, 0], // 🔴 merah untuk pixel yang hilang (baseline)
      diffColorAlt: [0, 0, 255], // 🔵 biru untuk pixel yang baru muncul
    },
  );

  fs.writeFileSync(outputDiffPath, PNG.sync.write(diff));

  const totalPixels = baseline.width * baseline.height;
  const diffPercentage = (diffPixelCount / totalPixels) * 100;

  return {
    match: diffPixelCount === 0,
    diffPixelCount,
    diffPercentage,
    diffPath: outputDiffPath,
  };
}
