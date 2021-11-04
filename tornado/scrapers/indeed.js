import fetch from "node-fetch";
import cheerio from "cheerio";

import fs from "fs";

console.log("Scraping Indeed!");

class IndeedQuery {
  constructor({
    keyword = "",
    city = "",
    radius = "25",
    level = "",
    maxAge = "",
    sort = "",
    filter = "0",
    jobType = "",
  }) {
    this.keyword = keyword;
    this.city = city;
    this.radius = radius;
    this.level = level;
    this.maxAge = maxAge;
    this.sort = sort;
    this.filter = filter;
    this.jobType = jobType;

    this.start = 0;
    this.jobUrls = [];
  }

  // thanks https://www.npmjs.com/package/indeed-scraper for the query params
  // update this if query ever changes
  url() {
    let query = "https://indeed.com/jobs";
    query += "?q=" + this.keyword;
    query += "&l=" + this.city;
    query += "&radius=" + this.radius;
    query += "&explvl=" + this.level;
    query += "&fromage=" + this.maxAge;
    query += "&sort=" + this.sort;
    query += "&filter=" + this.filter;
    query += "&jt=" + this.jobType;
    query += "&start=" + this.start;

    return encodeURI(query);
  }

  // update this if UI changes (cheerio/scraping)
  async scrapePageForJob(html) {
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

      return {
        title: jobtitle,
        summary: summary,
        url: url,
        company: company,
        location: location,
        postDate: postDate,
        salary: salary,
        isEasyApply: isEasyApply,
      };
    });

    return { jobObjects, isLastPage };
  }

  // we use a recursive strategy to get every page
  async recursivelyGetJobPage(jobData) {
    try {
      const response = await fetch(this.url(), {
        // TODO: run through new list of proxies
        // agent: new HttpsProxyAgent('http://152.179.12.86:3128')
      });
      const data = await response.text();
      const { jobObjects, isLastPage } = await this.scrapePageForJob(data);
      if (typeof jobObjects === "undefined")
        throw new Error("Undefined list of new jobs!");

      this.start += jobObjects.length;
      let newJobData = [...jobData, ...jobObjects];

      console.log(`Scraped the next ${jobObjects.length} jobs!`);

      // if (newJobData.length > 20) {
      //   console.log("Early return!")
      //   console.log(newJobData.length);
      //   return newJobData;
      // }

      if (isLastPage) {
        console.log("Reached end of jobs!");
        return newJobData;
      }

      return await this.recursivelyGetJobPage(newJobData);
    } catch (err) {
      console.log(err);
      return jobData;
    }
  }

  async getAllJobs() {
    const data = await this.recursivelyGetJobPage([]);
    console.log(`Got the data with length ${data?.length}`);
    return data;
  }
}

const getAllJobsForKeyword = async (keyword) => {
  console.time("Scraping time");
  const iq = new IndeedQuery({
    keyword,
  });

  const jobs = await iq.getAllJobs();
  console.timeEnd("Scraping time");
  console.log(`Jobs scraped: ${jobs.length}`);
  fs.writeFileSync("testdata_2.json", JSON.stringify(jobs));
};

getAllJobsForKeyword("art therapist");
