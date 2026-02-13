import puppeteer from 'puppeteer';

const url = 'http://localhost:5175/';
const outputPath = 'scripts/dashboard.png';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`Saved screenshot to ${outputPath}`);
  } catch (err) {
    console.error('Screenshot error:', err.message || err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
