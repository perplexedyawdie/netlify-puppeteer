// const chromium = require('chrome-aws-lambda');
// const { addExtra } = require('puppeteer-extra');
// // const puppCore = require('puppeteer-core');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer-extra');
// const puppeteer = addExtra(chromium.puppeteer);
puppeteer.use(StealthPlugin());
exports.handler = async function (event, context) {
  const requestBody = JSON.parse(event.body);
  const height = requestBody.height;
  const width = requestBody.width;

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: width,
    height: height,
    deviceScaleFactor: 1,
  });
  await page.goto('https://opensea.io/neverexposed');
  const pageHeight = await page.evaluate(() => {
    let body = document.body,
      html = document.documentElement;

      return Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    
  });
  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'Ok',
      pageHeight: pageHeight
    })
  };
}