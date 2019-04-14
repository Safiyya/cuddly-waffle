
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

server.get('/get/:url', function (req: express.Request, res: express.Response) {
  let url = req.params.url;
  puppeteer
    .launch()
    .then(function (browser) {
      return browser.newPage();
    })
    .then(function (page) {
      return page.goto(url, { waitUntil: 'networkidle0' }).then(function () {
        return page.content();
      });
    })
    .then(function (html) {
      res.send(html);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

/*
public traversePromise(root:TreeNode, callback: ((n: TreeNode) => Promise<void>)): Array<Promise<void>> {
    let queue: Array<Promise<void>> = [];

    let recursion = (node: TreeNode) => {
      if (node.children) {
        node.children.forEach(function (child: TreeNode) {
          queue.push(callback.apply(this, [child]));
          recursion(child)
        });
      }
    }

    recursion(root);
    return queue;
  }
  */

server.post('/parse/', function (req: express.Request, res: express.Response) {
  let html = req.body;
  console.log(html)

  puppeteer
    .launch()
    .then(function (browser) {
      return browser.newPage();
    })
    .then(function (page) {
      return page.setContent(html).then(() => { return page });
    })
    .then(function (page) {
     
      return page.$$eval("div", elements => {

        const getElement = (el: HTMLElement): { tag: string, class: string, color: string, backgroundColor: string } => {
          let tag = el.tagName;
          let color = getComputedStyle(el).color;
          let backgroundColor = getComputedStyle(el).backgroundColor;
          let classes = Array.from(el.classList.keys()).join(' ');

          return { tag: tag, class: classes, color: color, backgroundColor: backgroundColor };
        }
        
        return elements.map(d => getElement(d as HTMLElement))

      })
    })
    .then(function (result) {
      res.send(result)
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});



server.listen(3000, function () {
  console.log('Listening on port 3000!');
});