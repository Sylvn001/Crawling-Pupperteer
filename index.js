const pup = require("puppeteer");

const url = "https://www.mercadolivre.com.br/";
const searchFor = "Notebook";

const list = [];
let count = 0;

(async () => {
  const browser = await pup.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector("#cb1-edit");

  await page.type("#cb1-edit", searchFor);

  await Promise.all([
    page.waitForNavigation(),
    await page.click(".nav-search-btn"),
  ]);

  const links = await page.$$eval(".ui-search-result__image > a", (el) =>
    el.map((link) => link.href)
  );

  for (const link of links) {
    //Optional ~ for control numbers of request
    //count++;
    //if (count == 3) continue;

    await page.goto(link);

    await page.waitForSelector(".ui-pdp-title");

    const title = await page.$eval(
      ".ui-pdp-title",
      (element) => element.innerText
    );

    const price = await page.$eval(
      ".andes-money-amount__fraction",
      (element) => element.innerText
    );

    const seller = await page.evaluate(() => {
      const el = document.querySelector("ui-pdp-seller__link-trigger");
      if (!el) return null;
      return el.innerText;
    });

    const obj = {};
    obj.title = title;
    obj.price = price;

    obj.seller = seller ? seller : "";

    list.push(obj);
  }
  console.log(list);

  await browser.close();
})();
