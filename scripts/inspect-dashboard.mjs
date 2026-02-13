import puppeteer from 'puppeteer';

(async () => {
  const url = 'http://localhost:5175/';
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const consoleMessages = [];
  const failedRequests = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', err => {
    consoleMessages.push({ type: 'pageerror', text: String(err) });
  });
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), method: req.method(), failure: req.failure().errorText });
  });
  page.on('response', res => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), method: res.request().method(), status: res.status() });
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait a bit for React to render
    await new Promise(r => setTimeout(r, 1000));

    // Capture body background computed color
    const bg = await page.evaluate(() => {
      const body = document.querySelector('body');
      const rootContainer = document.querySelector('.min-h-screen') || document.querySelector('#root') || document.body;
      const cs = window.getComputedStyle(rootContainer);
      return {
        bodyBg: window.getComputedStyle(document.body).backgroundColor,
        containerBg: cs.backgroundColor,
        containerClasses: rootContainer.className || null,
      };
    });

    // Capture a trimmed snapshot of body text for quick diagnostics
    const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 500) || '');

    // Check for displayed total incomes text
    const totals = await page.evaluate(() => {
      const maybe = Array.from(document.querySelectorAll('p,span,div'))
        .map(n => ({text: n.textContent?.trim(), tag: n.tagName, classes: n.className}))
        .filter(x => x.text && /\$?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?/.test(x.text));
      // find nearest that looks like currency with $
      const currency = maybe.find(x => /\$/.test(x.text)) || maybe[0] || null;
      return currency;
    });

    // Check for chart elements (canvas or svg)
    const charts = await page.evaluate(() => {
      const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({ type: 'canvas', w: c.width, h: c.height, rect: c.getBoundingClientRect?.() }));
      const svgs = Array.from(document.querySelectorAll('svg')).map(s => ({ type: 'svg', rect: s.getBoundingClientRect?.() }));
      return { canvases, svgs };
    });

    // Look for hydration or tailwind related console messages
    const hydrationWarnings = consoleMessages.filter(m => /hydration|Expected server HTML to contain|Warning:.*hydration/i.test(m.text));
    const tailwindWarnings = consoleMessages.filter(m => /tailwind|class.*not found|Expected > but found client|use client/i.test(m.text));

    const result = {
      url,
      consoleMessages,
      failedRequests,
      hydrationWarnings,
      tailwindWarnings,
      bg,
      totals,
      bodyText,
      charts,
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Inspection error', e);
  } finally {
    await browser.close();
  }
})();
