const puppeteer = require('puppeteer');
const path = require('path');

const htmlDir = path.resolve(__dirname, '../1. HTML');
const imgDir  = path.resolve(__dirname, '../2. Images');

const files = [
  'checkpoints.html',
  'checkpoints-sunrise.html',
  'checkpoints-arctic.html',
  'checkpoints-forest.html',
  'checkpoints-mono.html',
  'checkpoints-neon.html',
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3 });

  for (const f of files) {
    const filePath = path.join(htmlDir, f);
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`);
    const out = path.join(imgDir, f.replace('.html', '.png'));
    await page.screenshot({ path: out, fullPage: false });
    console.log(`Saved: ${out}`);
  }

  await browser.close();
})();