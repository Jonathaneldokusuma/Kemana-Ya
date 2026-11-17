import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const resources = resolve(root, 'android/app/src/main/res');
const logo = await sharp(resolve(root, 'logo.png')).trim().png().toBuffer();
const canvas = (width, height, background) => sharp({ create: { width, height, channels: 4, background } });
const centeredLogo = async (size) => sharp(logo).resize(size, size, { fit: 'inside' }).toBuffer();

for (const [density, scale] of Object.entries({ mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 })) {
  const directory = join(resources, `mipmap-${density}`);
  await mkdir(directory, { recursive: true });
  const size = Math.round(48 * scale);
  const icon = await canvas(size, size, '#ffffff').composite([{ input: await centeredLogo(Math.round(36 * scale)), gravity: 'centre' }]).png().toBuffer();
  await sharp(icon).toFile(join(directory, 'ic_launcher.png'));
  const circle = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`);
  await sharp(icon).composite([{ input: circle, blend: 'dest-in' }]).png().toFile(join(directory, 'ic_launcher_round.png'));
  const foreground = Math.round(108 * scale);
  await canvas(foreground, foreground, '#00000000').composite([{ input: await centeredLogo(Math.round(60 * scale)), gravity: 'centre' }]).png().toFile(join(directory, 'ic_launcher_foreground.png'));
}

for (const entry of await readdir(resources, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('drawable')) continue;
  const path = join(resources, entry.name, 'splash.png');
  let metadata;
  try { metadata = await sharp(path).metadata(); } catch { continue; }
  const { width, height } = metadata;
  await canvas(width, height, '#f6f8f5').composite([{ input: await centeredLogo(Math.round(Math.min(width, height) * 0.25)), gravity: 'centre' }]).png().toFile(path);
}
console.log('Generated KemanaYa launcher icons and splash screens for Android.');
