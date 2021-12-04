import express from "express";
const app = express();
app.use(express.json());

import { EMSI } from "./emsi.js";

if (!process.env.SECRET_KEY) {
  throw new Error("Secret key missing!");
}

const secretKey = process.env.SECRET_KEY;

const buildEmsiWithConfig = ({ outputConfig, clientId, clientSecret }) => {
  return new EMSI({
    outputConfig,
    clientId,
    clientSecret,
  });
};

const paramsAreValid = (params) => {
  if (
    !params.MONGO_USER ||
    !params.MONGO_PASS ||
    !params.MONGO_DB ||
    !params.EMSI_CLIENT_ID ||
    !params.EMSI_CLIENT_SECRET
  ) {
    return false;
  }

  return true;
};

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/all", (req, res) => {
  const params = req.body;

  if (!params.SECRET_KEY || params.SECRET_KEY !== secretKey) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!paramsAreValid(params)) {
    res.status(406).send("Missing parameters");
    return;
  }

  const emsi = buildEmsiWithConfig({
    outputConfig: {
      MONGO_USER: params.MONGO_USER,
      MONGO_PASS: params.MONGO_PASS,
      MONGO_DB: params.MONGO_DB,
    },
    clientId: params.EMSI_CLIENT_ID,
    clientSecret: params.EMSI_CLIENT_SECRET,
  });

  emsi.setup().then(async () => {
    await emsi.setupScraper();
    await emsi.scrape();

    await emsi.setupTransformer();
    await emsi.transform();
  });

  res.status(200).send("Doing all!");
});

app.post("/scrape", (req, res) => {
  const params = req.body;

  if (!params.SECRET_KEY || params.SECRET_KEY !== secretKey) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!paramsAreValid(params)) {
    res.status(406).send("Missing parameters");
    return;
  }

  const emsi = buildEmsiWithConfig({
    outputConfig: {
      MONGO_USER: params.MONGO_USER,
      MONGO_PASS: params.MONGO_PASS,
      MONGO_DB: params.MONGO_DB,
    },
    clientId: params.EMSI_CLIENT_ID,
    clientSecret: params.EMSI_CLIENT_SECRET,
  });

  emsi.setup().then(async () => {
    await emsi.setupScraper();
    await emsi.scrape();
  });

  res.status(200).send("Scraping");
});

app.post("/transform", (req, res) => {
  const params = req.body;

  if (!params.SECRET_KEY || params.SECRET_KEY !== secretKey) {
    console.log(params);
    res.status(401).send("Unauthorized");
    return;
  }

  if (!paramsAreValid(params)) {
    res.status(406).send("Missing parameters");
    return;
  }

  const emsi = buildEmsiWithConfig({
    outputConfig: {
      MONGO_USER: params.MONGO_USER,
      MONGO_PASS: params.MONGO_PASS,
      MONGO_DB: params.MONGO_DB,
    },
    clientId: params.EMSI_CLIENT_ID,
    clientSecret: params.EMSI_CLIENT_SECRET,
  });

  emsi.setup().then(async () => {
    await emsi.setupTransformer();
    await emsi.transform();
  });

  res.status(200).send("Transforming");
});

app.listen(process.env.PORT || 80, () => {
  console.log(`listening on ${process.env.PORT || 80}`);
});
