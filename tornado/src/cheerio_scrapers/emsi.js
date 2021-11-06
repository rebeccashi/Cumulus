import fetch from "node-fetch";
import cheerio from "cheerio";

import fs from "fs";

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

console.log("Scraping EMSI!");

class EmsiQuery {
  constructor({
    outputDir="./output",
    clientId=process.env.EMSI_CLIENT_ID,
    clientSecret=process.env.EMSI_CLIENT_SECRET
  }) {
    this.outputDir = outputDir;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.parsedSkills = new Map();
    this.remainingSkills = new Map();

    try {
      console.log('Checking if output directory exists...');
      const files = fs.readdirSync(outputDir);
      console.log('It exists, adding existing skills to skip list!')

      files.forEach(file => this.parsedSkills.set(file, 1));
    } catch (err) {
      console.log('It does not exist! Creating it now...')
      fs.mkdirSync(outputDir)
      console.log('Created it successfully!')
    }
  }
  
  async getAccessToken() {
    console.log('Trying to get access token...');

    const form = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      scope: 'emsi_open'
    }
    
    const formBody = Object.keys(form).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(form[key])}`;
    }).join("&");

    const response = await fetch('https://auth.emsicloud.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody
    })

    const body = await response.json()

    this.accessToken = body.access_token;

    console.log("Got access token!")
  }

  async getRemainingSkills() {
    console.log('Trying to get all skills from API...');

    const response = await fetch('https://emsiservices.com/skills/versions/latest/skills', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    })

    const body = await response.json();

    body.data.forEach(skill => {
      this.remainingSkills.set(skill.name, skill.infoUrl);
    })

    console.log("Got skills from API!")
  }

  // update this if UI changes (cheerio/scraping)
  async scrapeHTMLForSkill(html) {
    const $ = cheerio.load(html);

    const pagination = $(".pagination");
    const isLastPage =
      pagination.length === 0 ||
      pagination.find("a[aria-label='Next']").length === 0;

    const jobTable = $("#resultsCol");
    const jobs = jobTable.find(".result");

    const jobObjects = jobs.map((i, e) => {
      const job = $(e);

      const jobtitle = job.find(".jobTitle > span").text().trim();

      const url = "https://indeed.com" + job.attr("href");

      const summary = job.find(".job-snippet").text().trim();

      const company = job.find(".companyName").text().trim() || null;

      const location = job.find(".companyLocation").text().trim();

      const postDate = job.find(".date").text().trim();

      const salary = job.find(".salary-snippet").text().trim();

      const isEasyApply = job.find(".ialbl").text().trim() === "Easily apply";

      this.jobUrls.push(url);

      const skill = "";
      const titles = [];
      const companies = [];
      const timeseries = [];

      return {
        skill,
        titles,
        companies,
        timeseries
      };
    });

    return { skillData };
  }

  async fetchSkill(skill) {
    console.log(`Fetching skill ${skill}...`);

    const url = this.remainingSkills.get(skill);

    const response = await fetch(url);
    const body = await response.text();

    const data = this.scrapeHTMLForSkill(body);

    console.log(data);

    fs.writeFileSync(
      `cheerio_scrapers/${keyword.replace(" ", "_")}_${dateKebab()}.json`,
      JSON.stringify(jobs)
    );

    console.log(`Wrote skill ${skill} to disk!`)
  }

  async scrape() {
    console.log('Starting to scrape...');

    // await this.getRemainingSkills();
    this.remainingSkills.set('JavaScript (Programming Language)', 'https://skills.emsidata.com/skills/KS1200771D9CR9LB4MWW');

    const fetchAllSkills = new Promise((resolve, reject) => {
      this.remainingSkills.forEach(async skill => {
        if (this.parsedSkills.has(skill)) return;

        await this.fetchSkill(skill);
        this.parsedSkills.set(skill, 1);

        if (this.remainingSkills.size == this.parsedSkills.size) resolve();

        await sleep(500);
      })
    });

    await fetchAllSkills
    console.log('Done scraping!')
  }
}

const runScraper = async () => {
  const eq = new EmsiQuery({
    clientId: process.env.EMSI_CLIENT_ID,
    clientSecret: process.env.EMSI_CLIENT_SECRET
  });

  await eq.getAccessToken();
  await eq.scrape();
};

runScraper();
