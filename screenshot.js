const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await page.goto('http://localhost:8888/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'preview-full.png', fullPage: false });
    await page.screenshot({ path: 'preview-full-page.png', fullPage: true });
    await browser.close();
    console.log('Screenshots saved!');
})();
