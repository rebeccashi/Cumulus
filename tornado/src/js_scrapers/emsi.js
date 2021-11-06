import fetch from "node-fetch";
import puppeteer from "puppeteer";

import fs from "fs";

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const retry = async (callback, count, description) => {
  console.log(`(Re)trying function: ${description}...`);

  try {
    return await callback();
  } catch (err) {
    console.log(`Function ${description} failed with ${count} tries left!`)
    if (count <= 0) {
      console.log(`Throwing this error to caller!`)
      throw err;
    }

    await sleep(1000);
    
    console.log(`Trying again now...`)
    return await retry(callback, count - 1);
  }
}

console.log("Scraping EMSI!");

class EmsiQuery {
  constructor({
    outputDir = "./output",
    clientId = process.env.EMSI_CLIENT_ID,
    clientSecret = process.env.EMSI_CLIENT_SECRET,
  }) {
    this.outputDir = outputDir;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.parsedSkills = new Map();
    this.remainingSkills = new Map();

    try {
      console.log("Checking if output directory exists...");
      const files = fs.readdirSync(outputDir);
      console.log("It exists, adding existing skills to skip list!");

      files.forEach((file) => this.parsedSkills.set(file, 1));
    } catch (err) {
      console.log("It does not exist! Creating it now...");
      fs.mkdirSync(outputDir);
      console.log("Created it successfully!");
    }
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
    const skill = await this.page.evaluate(() => {
      return document.querySelector("h1.cUdUkR").textContent;
    });

    let titles = {};
    let companies = {};
    const timeseries = {};

    try {
      titles = await this.page.evaluate(() => {
        const data = {};

        const table = document.querySelectorAll("table.bFBCms")[0];
        Array.from(table.querySelectorAll("tbody tr")).forEach((row) => {
          data[row.querySelectorAll("td")[0].textContent] =
            row.querySelectorAll("td")[1].textContent;
        });

        return data;
      });

      companies = await this.page.evaluate(() => {
        const data = {};

        const table = document.querySelectorAll("table.bFBCms")[1];
        Array.from(table.querySelectorAll("tbody tr")).forEach((row) => {
          data[row.querySelectorAll("td")[0].textContent] =
            row.querySelectorAll("td")[1].textContent;
        });

        return data;
      });

      const months = await this.page.evaluate(() => {
        const svg = document.querySelector("svg.recharts-surface");

        const xAxis = svg.querySelector(".xAxis");

        const months = [];
        Array.from(xAxis.querySelectorAll("text")).forEach((text) =>
          months.push(text.textContent)
        );

        return months;
      });

      for (let index = 0; index < months.length; index++) {
        let month = months[index];

        await this.page.hover(
          `svg.recharts-surface g.recharts-cartesian-grid-vertical line:nth-child(${
            index + 1
          })`
        );

        const text = await this.page.evaluate(() => {
          const tooltip = document.querySelector(
            "div.recharts-tooltip-wrapper"
          );

          return tooltip.querySelector("div.cfevtU div:nth-child(2)")
            .textContent;
        });

        timeseries[month] = text.split(":")[1].trim();
      }
    } catch (err) {
      console.error(err);
    }

    return {
      skill,
      titles,
      companies,
      timeseries,
    };
  }

  async fetchSkill(skill) {
    console.log(`Fetching skill ${skill}...`);

    const url = this.remainingSkills.get(skill);

    await retry(() => this.page.goto(url, { waitUntil: "networkidle0" }), 10, `Get skill ${skill}`)

    const data = await this.scrapeHTMLForSkill();

    fs.writeFileSync(`${this.outputDir}/${skill.replace(/[\\/:"*?<>|]+/g, '-')}`, JSON.stringify(data));

    console.log(`Wrote skill ${skill} to disk!`);
  }

  async scrape() {
    console.log("Starting to scrape...");

    await this.getRemainingSkills();
    // this.remainingSkills.set('JavaScript (Programming Language)', 'https://skills.emsidata.com/skills/KS1200771D9CR9LB4MWW');

    for (let [skill, _] of this.remainingSkills) {
      console.log(`Checking if we need to fetch skill ${skill}...`);
      if (this.parsedSkills.has(skill.replace(/[\\/:"*?<>|]+/g, '-'))) {
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
}

const runScraper = async () => {
  const eq = new EmsiQuery({
    clientId: process.env.EMSI_CLIENT_ID,
    clientSecret: process.env.EMSI_CLIENT_SECRET,
  });

  await eq.getAccessToken();
  await eq.setupPuppeteer();
  await eq.scrape();
};

runScraper();
