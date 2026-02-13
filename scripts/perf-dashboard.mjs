import puppeteer from 'puppeteer';

const url = 'http://localhost:5175/';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    const start = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const navTiming = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType('navigation');
      if (!entry) return null;
      return {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
        loadEvent: entry.loadEventEnd - entry.startTime,
        responseTime: entry.responseEnd - entry.requestStart,
      };
    });
    const totalMs = Date.now() - start;
    console.log(JSON.stringify({ url, totalMs, navTiming }, null, 2));
  } catch (err) {
    console.error('Perf error:', err.message || err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
