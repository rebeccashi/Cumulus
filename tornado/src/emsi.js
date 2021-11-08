import fetch from "node-fetch";
import puppeteer from "puppeteer";

import { retry, sleep } from "./util/util.js";

const EMSIOUTPUT = {
  FILESYSTEM: "fs",
  MONGODB: "mdb",
};

class EMSI {
  constructor({
    output = EMSIOUTPUT.FILESYSTEM,
    outputDb = "./db",
    clientId = "",
    clientSecret = "",
  }) {
    this.output = output;
    this.outputDb = outputDb;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    const dbWrapper = await import(`./util/${this.output}.js`);
    dbWrapper.populateParsedSkills(this);
  }

  async setupScraper() {
    await this.getAccessToken();
    await this.setupPuppeteer();

    let dateObj = new Date();
    this.date = `${dateObj.getUTCMonth() + 1}-${dateObj.getUTCFullYear()}`;

    this.skillIdMap = new Map();
    this.parsedSkills = new Map();
    this.remainingSkills = new Map();

    import(`./util/${this.output}.js`).then((dbWrapper) =>
      dbWrapper.populateParsedSkills(this)
    );
  }

  async getAccessToken() {
    console.log("Trying to get access token...");

    const form = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "client_credentials",
      scope: "emsi_open",
    };

    const formBody = Object.keys(form)
      .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(form[key])}`;
      })
      .join("&");

    const response = await fetch("https://auth.emsicloud.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    const body = await response.json();

    this.accessToken = body.access_token;

    console.log("Got access token!");
  }

  async setupPuppeteer() {
    console.log("Setting up Puppeteer...");

    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();

    console.log("Set up Puppeteer!");
  }

  async getRemainingSkills() {
    console.log("Trying to get all skills from API...");

    const response = await fetch(
      "https://emsiservices.com/skills/versions/latest/skills",
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    const body = await response.json();

    body.data.forEach((skill) => {
      this.remainingSkills.set(skill.name, skill.infoUrl);
    });

    console.log("Got skills from API!");
  }

  async scrapeHTMLForSkill() {
    const name = await this.page.evaluate(() => {
      return document.querySelector("h1.cUdUkR").textContent;
    });

    let titles = [];
    let companies = [];
    let numJobs = 0;

    try {
      titles = await this.page.evaluate(() => {
        const data = {};

        const table = document.querySelectorAll("table.bFBCms")[0];
        Array.from(table.querySelectorAll("tbody tr")).forEach((row) => {
          data.push({
            name: row.querySelectorAll("td")[0].textContent,
            numJobs: row.querySelectorAll("td")[1].textContent,
          });
        });

        return data;
      });

      titles.sort((a, b) => b.numJobs - a.numJobs);
    } catch (err) {
      console.log("Missing job title data! Skipping...");
    }

    try {
      companies = await this.page.evaluate(() => {
        const data = {};

        const table = document.querySelectorAll("table.bFBCms")[1];
        Array.from(table.querySelectorAll("tbody tr")).forEach((row) => {
          data.push({
            name: row.querySelectorAll("td")[0].textContent,
            numJobs: row.querySelectorAll("td")[1].textContent,
          });
        });

        return data;
      });

      titles.sort((a, b) => b.numJobs - a.numJobs);
    } catch (err) {
      console.log("Missing company data! Skipping...");
    }

    try {
      await this.page.hover(
        "svg.recharts-surface g.recharts-cartesian-grid-vertical line:nth-child(11)"
      );

      const text = await this.page.evaluate(() => {
        const tooltip = document.querySelector("div.recharts-tooltip-wrapper");

        return tooltip.querySelector("div.cfevtU div:nth-child(2)").textContent;
      });

      numJobs = text.split(":")[1].trim();
    } catch (err) {
      console.log("Missing timeseries data! Skipping...");
    }

    return {
      name,
      date: this.date,
      numJobs,
      titles,
      companies,
    };
  }

  async fetchSkill(skill) {
    console.log(`Fetching skill ${skill}...`);

    const url = this.remainingSkills.get(skill);

    await retry(
      () => this.page.goto(url, { waitUntil: "networkidle0" }),
      10,
      `Get skill ${skill}`
    );

    const data = await this.scrapeHTMLForSkill();

    if (data.numJobs == 0) {
      console.log(`Skill ${skill} has no available data! Skipping...`);
      return;
    } else {
      const dbWrapper = await import(`./util/${this.output}.js`);
      dbWrapper.writeSkill(this, data);

      console.log(`Wrote skill ${skill} to disk!`);
    }
  }

  async scrape() {
    console.log("Starting to scrape...");

    await this.getRemainingSkills();

    for (let [skill, _] of this.remainingSkills) {
      console.log(`Checking if we need to fetch skill ${skill}...`);
      console.log(
        `[INFO] Currently on skill ${this.parsedSkills.size + 1} of ${
          this.remainingSkills.size
        }`
      );
      if (this.parsedSkills.has(skill)) {
        console.log(`We do not, skipping!`);
        continue;
      }

      console.log("Yes we do!");

      await this.fetchSkill(skill);
      this.parsedSkills.set(skill, 1);

      await sleep(500);
    }

    console.log("Done scraping!");
  }

  async transform() {
    console.log("Hi!");
  }
}

const runScraper = async () => {
  const emsi = new EMSI({
    clientId: process.env.EMSI_CLIENT_ID,
    clientSecret: process.env.EMSI_CLIENT_SECRET,
  });

  await emsi.setupScraper();
  await emsi.scrape();
};

const runTransformer = async () => {
  const emsi = new EMSI();

  await emsi.transform();
};

if (process.env.MODE === "scrape" || process.env.MODE === "full") {
  runScraper();
}
if (process.env.MODE === "transform" || process.env.MODE === "full") {
  runTransformer();
}
