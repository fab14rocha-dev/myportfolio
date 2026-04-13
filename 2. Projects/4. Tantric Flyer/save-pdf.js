const puppeteer = require('puppeteer');
const path = require('path');

const pages = [
  { file: 'index.html',             output: 'PDFs/flyer-dark-burgundy.pdf' },
  { file: 'flyer-white.html',       output: 'PDFs/flyer-white.pdf' },
  { file: 'flyer-white-large.html', output: 'PDFs/flyer-white-large-2pages.pdf' },
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 }); // A4 at 96dpi

  for (const { file, output } of pages) {
    const url = `file://${path.resolve(__dirname, file)}`;
    console.log(`Generating ${output}...`);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: output,
      width:  '210mm',
      height: '297mm',
      printBackground: true,
    });
    console.log(`✅ Saved: ${output}`);
  }

  await browser.close();
  console.log('\nDone! Both PDFs saved.');
})();
