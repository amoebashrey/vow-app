import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

async function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#F9F9F9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = Math.round(size * 0.78);
  ctx.font = `${fontSize}px serif`;
  ctx.fillText('V', size / 2, size / 2 + size * 0.04);
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(outputPath, buffer);
  console.log(`Generated ${outputPath}`);
}

await generateIcon(192, 'public/icon-192.png');
await generateIcon(512, 'public/icon-512.png');
