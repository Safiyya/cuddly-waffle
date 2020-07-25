import express from "express";
import puppeteer from "puppeteer";

/**
 * Get a screenshot of the required URL in Base64
 */
export const getScreenshot = (req: express.Request, res: express.Response) => {
  // let image = fs.readFileSync(path.resolve(__dirname,"..", "mocks", "page.png"));

  // return res.send(new Buffer(image).toString("base64"))

  const url = req.params.url;
  puppeteer
    .launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    .then((browser) => {
      return browser.newPage();
    })
    .then((page) => {
      return page
        .goto(url, {
          waitUntil: "networkidle0",
        })
        .then(() => {
          return page.screenshot({
            encoding: "base64",
            fullPage: true,
          });
        });
    })
    .then((base64String) => {
      res.send(base64String);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
};

/**
 * Mine requested URL for color, backgroundColor, border, stroke and fill color codes
 */
export const parseUrl = (req: express.Request, res: express.Response) => {
  // let results = fs.readFileSync(path.resolve(__dirname,"..", "mocks", "colors.json"), "utf-8");
  // res.send(JSON.parse(results).colors);

  const url = req.params.url;

  puppeteer
    .launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    .then((browser) => {
      return browser.newPage();
    })
    .then(
      (page) => {
        return page.goto(url, { waitUntil: "networkidle0" }).then(function() {
          return page;
        });
      },
      (reason) => {
        throw reason;
      }
    )
    .then(
      (page) => {
        return page.$$eval(
          "*:not(meta):not(html):not(title):not(head):not(link):not(script):not(noscript):not(style)",
          (elements) => {
            const getElement = (
              el: HTMLElement
            ): Array<{ tag: string; class: string; color: string }> => {
              const tag = el.tagName;
              const color = getComputedStyle(el).color || "";
              const backgroundColor =
                getComputedStyle(el).backgroundColor || "";
              const borderTopColor = getComputedStyle(el).borderTopColor || "";
              const borderBottomColor =
                getComputedStyle(el).borderBottomColor || "";
              const borderLeftColor =
                getComputedStyle(el).borderLeftColor || "";
              const borderRightColor =
                getComputedStyle(el).borderRightColor || "";
              const stroke = getComputedStyle(el).stroke || "";
              const fill = getComputedStyle(el).fill || "";
              const classes = Array.from(el.classList.values()).join(" ");

              const backgroundImage =
                getComputedStyle(el).backgroundImage || "";
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

            return elements
              .map((d: any) => getElement(d as HTMLElement))
              .reduce((pre: any[], cur: any) => pre.concat(cur), [])
              .filter((el: any) => el.color !== "none");
          }
        );
      },
      (reason) => {
        throw reason;
      }
    )
    .then(
      (result) => {
        // console.log(result)
        res.send(result);
      },
      (reason) => {
        throw reason;
      }
    )
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
};
