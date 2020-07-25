import express, { Router } from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import timeout from "connect-timeout";
import { getScreenshot, parseUrl } from "./api";

const app: express.Application = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.text({ type: "text/html", limit: 100000000 }));
app.use(timeout("120s"));
app.use(haltOnTimedout);

function haltOnTimedout(
  req: any,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.timeout) {
    next();
  }
}

const router: Router = Router({ strict: true });

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("ROOT");
});

app.get("/ping", (req: express.Request, res: express.Response) => {
  res.status(200).send("pong");
});

router.get("/screenshot/:url", getScreenshot);
router.get("/parse/:url", parseUrl);

app.use("/", router);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

exports.handler = serverless(app);
