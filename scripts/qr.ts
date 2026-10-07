import { mkdirSync } from 'node:fs';
import QRCode from 'qrcode';

const url = process.env.APP_URL;
if (!url) {
  console.error('Set APP_URL to the public address of the app, e.g. APP_URL=https://apply.example.com npm run qr');
  process.exit(1);
}

const options = {
  errorCorrectionLevel: 'H' as const,
  margin: 4,
  color: { dark: '#2B0D35', light: '#FFFFFF' },
};

mkdirSync('public', { recursive: true });
await QRCode.toFile('public/qr.png', url, { ...options, type: 'png', width: 1024 });
await QRCode.toFile('public/qr.svg', url, { ...options, type: 'svg' });
console.log(`Wrote public/qr.png (1024px) and public/qr.svg for ${url}`);
