
import express from "express";
import puppeteer from "puppeteer";
import bodyParser from "body-parser";
const server: express.Application = express();

server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.use(bodyParser.text({ type: 'text/html', limit: 100000000 }))


// server.get('/get/:url', function (req: express.Request, res: express.Response) {
//   let url = req.params.url;
//   puppeteer
//     .launch()
//     .then(function (browser) {
//       return browser.newPage();
//     })
//     .then(function (page) {
//       return page.goto(url, { waitUntil: 'networkidle0' }).then(function () {
//         return page.content();
//       });
//     })
//     .then(function (html) {
//       res.send(html);
//     })
//     .catch(function (err) {
//       res.status(500).send(err);
//     });
// });

server.get('/evaluate/:url', function (req: express.Request, res: express.Response) {
  let url = req.params.url;
  
  puppeteer
    .launch()
    .then(function (browser) {
      return browser.newPage();
    })
    .then(function (page) {
      return page.goto(url, { waitUntil: 'networkidle0' }).then(function () {
        return page;
      });
    })
    .then(function (page) {
      
      return page.$$eval("*:not(meta):not(title):not(head):not(link):not(script):not(noscript):not(style)", elements => {

        const getElement = (el: HTMLElement): { tag: string, class: string, color: string }[] => {
          let tag = el.tagName;
          let color = getComputedStyle(el).color;
          let backgroundColor = getComputedStyle(el).backgroundColor;
          let borderTopColor = getComputedStyle(el).borderTopColor;
          let borderBottomColor = getComputedStyle(el).borderBottomColor;
          let borderLeftColor = getComputedStyle(el).borderLeftColor;
          let borderRightColor = getComputedStyle(el).borderRightColor;
          let stroke = getComputedStyle(el).stroke;
          let fill = getComputedStyle(el).fill;
          let classes = Array.from(el.classList.values()).join(' ');

          let backgroundImage = getComputedStyle(el).backgroundImage;
          let regex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/g;

          let gradients = (backgroundImage.match(regex) || []).map(m => m.toString());

          return [{ tag: tag, class: classes, color: color },
          { tag: tag, class: classes, color: backgroundColor },
          { tag: tag, class: classes, color: borderTopColor },
          { tag: tag, class: classes, color: borderBottomColor },
          { tag: tag, class: classes, color: borderLeftColor },
          { tag: tag, class: classes, color: borderRightColor },
          { tag: tag, class: classes, color: stroke },
          { tag: tag, class: classes, color: fill },
        ...gradients.map(g => {return { tag: tag, class: classes, color: g }})
      ]

        }

        return elements
          .map(d => getElement(d as HTMLElement))
          .reduce((pre, cur) => pre.concat(cur), [])
          .filter(el => el.color !== 'none')

      })
    })
    .then(function (result) {
      // console.log(result)
      res.send(result)
    })
    .catch(function (err) {
      console.error(err)
      res.status(500).send(err);
    });
});



// server.post('/parse/', function (req: express.Request, res: express.Response) {
//   let html = req.body;

//   puppeteer
//     .launch()
//     .then(function (browser) {
//       return browser.newPage();
//     })
//     .then(function (page) {
//       return page.setContent(html).then(() => { return page });
//     })
//     .then(function (page) {

//       return page.$$eval("*", elements => {

//         const getElement = (el: HTMLElement): { tag: string, class: string, color: string }[] => {
//           let tag = el.tagName;
//           let color = getComputedStyle(el).color;
//           let backgroundColor = getComputedStyle(el).backgroundColor;
//           let background = getComputedStyle(el).background;
//           let borderTopColor = getComputedStyle(el).borderTopColor;
//           let borderBottomColor = getComputedStyle(el).borderBottomColor;
//           let borderLeftColor = getComputedStyle(el).borderLeftColor;
//           let borderRightColor = getComputedStyle(el).borderRightColor;
//           let stroke = getComputedStyle(el).stroke;
//           let fill = getComputedStyle(el).fill;
//           let classes = Array.from(el.classList.values()).join(' ');

//           return [{ tag: tag, class: classes, color: color },
//           { tag: tag, class: classes, color: backgroundColor },
//           { tag: tag, class: classes, color: background },
//           { tag: tag, class: classes, color: borderTopColor },
//           { tag: tag, class: classes, color: borderBottomColor },
//           { tag: tag, class: classes, color: borderLeftColor },
//           { tag: tag, class: classes, color: borderRightColor },
//           { tag: tag, class: classes, color: stroke },
//           { tag: tag, class: classes, color: fill }]

//         }

//         let regex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/g;

//         return elements
//           .map(d => getElement(d as HTMLElement))
//           .reduce((pre, cur) => pre.concat(cur), [])
//           .filter(el => regex.test(el.color))

//       })
//     })
//     .then(function (result) {
//       res.send(result)
//     })
//     .catch(function (err) {
//       res.status(500).send(err);
//     });
// });



server.listen(3000, function () {
  console.log('Listening on port 3000!');
});