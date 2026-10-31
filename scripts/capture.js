import { execSync } from 'child_process';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3001';
const out = process.argv[3] || 'screenshot.png';
const width = process.argv[4] || 1600;
const height = process.argv[5] || 1000;

try {
  execSync(
    `chromium --headless --no-sandbox --disable-gpu --window-size=${width},${height} --screenshot=${out} "${url}"`,
    { stdio: 'inherit' }
  );
  console.log(`Saved screenshot to ${out}`);
} catch (e) {
  console.error('Failed to capture screenshot:', e);
}
