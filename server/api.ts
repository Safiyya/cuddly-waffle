import { Request, Response } from "express";
import chromium = require("chrome-aws-lambda");

/**
 * Get a screenshot of the required URL in Base64
 */
export const getScreenshot = async (req: Request, res: Response) => {
  // let image = fs.readFileSync(path.resolve(__dirname,"..", "mocks", "page.png"));

  // return res.send(new Buffer(image).toString("base64"))
  const path = await chromium.executablePath;

  try {
    const url = req.params.url;
    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    const screenshot = await page
      .goto(url, {
        waitUntil: "networkidle0",
      })
      .then(() => {
        return page.screenshot({
          encoding: "base64",
          fullPage: true,
        });
      });

    res.send(screenshot);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Mine requested URL for color, backgroundColor, border, stroke and fill color codes
 */
export const parseUrl = async (req: Request, res: Response) => {
  // let results = fs.readFileSync(path.resolve(__dirname,"..", "mocks", "colors.json"), "utf-8");
  // res.send(JSON.parse(results).colors);
  try {
    const path = await chromium.executablePath;

    const url = req.params.url;

    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    const html = await page.goto(url, { waitUntil: "networkidle0" }).then(
      () => {
        return page;
      },
      (reason) => {
        throw reason;
      }
    );

    const colors = await page.$$eval(
      "*:not(meta):not(html):not(title):not(head):not(link):not(script):not(noscript):not(style)",
      (elements) => {
        return elements
          .map((d: any) => getElement(d as HTMLElement))
          .reduce((pre: any[], cur: any) => pre.concat(cur), [])
          .filter((el: any) => el.color !== "none");
      }
    );

    res.send(colors);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getElement = (
  el: HTMLElement
): Array<{ tag: string; class: string; color: string }> => {
  const tag = el.tagName;
  const color = getComputedStyle(el).color || "";
  const backgroundColor = getComputedStyle(el).backgroundColor || "";
  const borderTopColor = getComputedStyle(el).borderTopColor || "";
  const borderBottomColor = getComputedStyle(el).borderBottomColor || "";
  const borderLeftColor = getComputedStyle(el).borderLeftColor || "";
  const borderRightColor = getComputedStyle(el).borderRightColor || "";
  const stroke = getComputedStyle(el).stroke || "";
  const fill = getComputedStyle(el).fill || "";
  const classes = Array.from(el.classList.values()).join(" ");

  const backgroundImage = getComputedStyle(el).backgroundImage || "";
  const regex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/g;

  const gradients = (backgroundImage.match(regex) || []).map((m) =>
    m.toString()
  );

  return [
    { tag, class: classes, color },
    { tag, class: classes, color: backgroundColor },
    { tag, class: classes, color: borderTopColor },
    { tag, class: classes, color: borderBottomColor },
    { tag, class: classes, color: borderLeftColor },
    { tag, class: classes, color: borderRightColor },
    { tag, class: classes, color: stroke },
    { tag, class: classes, color: fill },
    ...gradients.map((g: string) => {
      return { tag, class: classes, color: g };
    }),
  ];
};
