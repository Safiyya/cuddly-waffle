
import express from "express";
import * as request from "request-promise";
import puppeteer from "puppeteer";

const server: express.Application = express();

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.get('/:url', function (req: express.Request, res: express.Response) {
  let url = req.params.url;
  console.log("get", url)
  puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(url,{waitUntil: 'networkidle0'}).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    // console.log(html)
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    res.send(html);
  })
  .catch(function(err) {
    res.status(500).send(err);
    console.error(url, err)
  });
});



server.listen(3000, function () {
  console.log('Listening on port 3000!');
});