import express from "express";
const app = express();

import { EMSI } from "./emsi.js";

let lock = null;

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/status", (req, res) => {
  if (lock === null) {
    res.status(200).send("Idle");
  } else {
    res.status(200).send({
      status: lock,
    });
  }
});

app.post("/all", (req, res) => {
  lock = "scrape";
  res.status(200).send("Doing all!");
  lock = null;
});

app.post("/scrape", (req, res) => {
  lock = "scrape";
  res.status(200).send("Scraping");
  lock = null;
});

app.post("/transform", (req, res) => {
  lock = "scrape";
  res.status(200).send("Transforming");
  lock = null;
});

app.listen(process.env.PORT || 80, () => {
  console.log(`listening on ${process.env.PORT || 80}`);
});
