
const chromium = require('chrome-aws-lambda');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const {addExtra } = require('puppeteer-extra');
// const puppeteer = addExtra(chromium.puppeteer);
// const puppeteer = addExtra(chromium.puppeteer);
const puppeteerCloak = require('puppeteer-cloak');
// puppeteer.use(StealthPlugin());
exports.handler = async function (event, context) {
  const requestBody = JSON.parse(event.body);
  const height = requestBody.height;
  const width = requestBody.width;
  console.log(chromium.args)
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true,
  });

  const page = (await browser.pages())[0];
  const cloakedPage = puppeteerCloak(page);
  await cloakedPage.setViewport({
    width: width,
    height: height,
    deviceScaleFactor: 1,
  });
  await cloakedPage.goto('https://opensea.io/neverexposed');
  const pageHeight = await cloakedPage.evaluate(() => {
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