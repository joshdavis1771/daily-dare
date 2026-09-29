import sharp from 'sharp';

const source = process.argv[2];
if (!source) throw new Error('Pass the original logo image path.');
const suffix = process.argv[3] ?? 'v2';
const goldDare = suffix.includes('plus');
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const dark = Buffer.from(data);
const light = Buffer.from(data);
let left = info.width, top = info.height, right = 0, bottom = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const alpha = Math.max(0, Math.min(1, (Math.max(r, g, b) - 28) / 217));
    const red = r > g * 1.5 && r > b * 1.5;
    dark[i + 3] = light[i + 3] = Math.round(alpha * 255);
    if (!alpha) continue;
    const dare = x >= Math.floor(info.width * 0.48);
    const goldProgress = Math.max(0, Math.min(1, (x / info.width - 0.48) / 0.48));
    const darkGold = [253, 230, 138].map((start, index) => Math.round(start + ([245, 158, 11][index] - start) * goldProgress));
    const lightGold = [253, 186, 116].map((start, index) => Math.round(start + ([180, 83, 9][index] - start) * goldProgress));
    const darkColor = dare && goldDare ? darkGold : [255, 255, 255];
    const lightColor = dare && goldDare ? lightGold : [0, 0, 0];
    const shineCenter = info.width * 0.72 + (y - info.height / 2) * 0.18;
    const shine = dare && goldDare ? Math.max(0, 1 - Math.abs(x - shineCenter) / (info.width * 0.045)) : 0;
    for (let c = 0; c < 3; c++) {
      dark[i + c] = red ? Math.min(255, Math.max(0, (data[i + c] - 12 * (1 - alpha)) / alpha)) : darkColor[c];
      light[i + c] = red ? dark[i + c] : lightColor[c];
      if (!red && shine) {
        const darkReflectiveGold = [255, 244, 180][c];
        const lightReflectiveGold = [255, 220, 150][c];
        dark[i + c] = Math.round(dark[i + c] + (darkReflectiveGold - dark[i + c]) * shine * 0.88);
        light[i + c] = Math.round(light[i + c] + (lightReflectiveGold - light[i + c]) * shine * 0.76);
      }
    }
    if (alpha > 0.1) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  }
}
// Lighten only “Daily”; the gap before “Dare” is at 48% of the source width.
const alpha = Buffer.alloc(info.width * info.height);
for (let i = 0; i < alpha.length; i++) alpha[i] = dark[i * 4 + 3];
const horizontal = Buffer.alloc(alpha.length);
const thinnerAlpha = Buffer.alloc(alpha.length);
const radius = 6;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  let value = 255;
  for (let dx = -radius; dx <= radius; dx++) value = Math.min(value, alpha[y * info.width + Math.max(0, Math.min(info.width - 1, x + dx))]);
  horizontal[y * info.width + x] = value;
}
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  let value = 255;
  for (let dy = -radius; dy <= radius; dy++) value = Math.min(value, horizontal[Math.max(0, Math.min(info.height - 1, y + dy)) * info.width + x]);
  thinnerAlpha[y * info.width + x] = value;
}
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < Math.floor(info.width * 0.48); x++) {
    const i = y * info.width + x;
    dark[i * 4 + 3] = light[i * 4 + 3] = thinnerAlpha[i];
  }
}
const crop = { left: Math.max(0, left - 8), top: Math.max(0, top - 8), width: right - left + 17, height: bottom - top + 17 };
for (const [name, pixels] of [['dark', dark], ['light', light]]) {
  await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } }).extract(crop).png().toFile(`public/brand/daily-dare-${name}-${suffix}.png`);
}
console.log(`Saved transparent logos: ${crop.width} × ${crop.height}`);
