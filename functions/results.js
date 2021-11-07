
const chromium = require('chrome-aws-lambda');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const {addExtra } = require('puppeteer-extra');
// const puppeteer = addExtra(chromium.puppeteer);
// const puppeteer = addExtra(chromium.puppeteer);
const puppeteerCloak = require('puppeteer-cloak');
// puppeteer.use(StealthPlugin());
exports.handler = async function (event, context) {
  function evadr() {
    Object.defineProperty(navigator, "languages", {
      get: function() {
        return ["en-US", "en"];
      }
    });
    
    // overwrite the `plugins` property to use a custom getter
    Object.defineProperty(navigator, 'plugins', {
      get: function() {
        // this just needs to have `length > 0`, but we could mock the plugins too
        return [1, 2, 3, 4, 5];
      },
    });
    Object.defineProperty(navigator, 'webdriver', { get: () => false, });
  }
  const requestBody = JSON.parse(event.body);
  const height = requestBody.height;
  const width = requestBody.width;
  console.log(chromium.args)
  const browser = await chromium.puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    executablePath: await chromium.executablePath,
    headless: true,
  });

  const page = await browser.pages();
  await page.evaluateOnNewDocument(evadr());
  await page.setViewport({
    width: width,
    height: height,
    deviceScaleFactor: 1,
  });
  
  await page.goto('https://opensea.io/neverexposed');
  await page.on("request", r => {
    if (
      ["image", "stylesheet", "font", "script"].indexOf(r.resourceType()) !== -1 
    ) {
      r.abort();
    } else {
      r.continue();
    }
  });
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