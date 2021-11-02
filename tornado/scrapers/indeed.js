import fetch from "node-fetch";
import cheerio from "cheerio";

console.log("Scraping Indeed!");

class IndeedQuery {
  constructor({
    keyword = "",
    city = "",
    radius = "25",
    level = "",
    maxAge = "",
    sort = "",
    jobType = "",
  }) {
    this.keyword = keyword;
    this.city = city;
    this.radius = radius;
    this.level = level;
    this.maxAge = maxAge;
    this.sort = sort;
    this.jobType = jobType;

    this.start = 0;
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
    query += "&jt=" + this.jobType;
    query += "&start=" + this.start;

    return encodeURI(query);
  }

  // update this if UI changes (cheerio/scraping)
  scrapePageForJob(html) {
    const $ = cheerio.load(html);
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

    return jobObjects;
  }

  // we use a recursive strategy to get every page
  recursivelyGetJobPage(jobData) {
    fetch(this.url(), {
      // TODO: run through new list of proxies
      // agent: new HttpsProxyAgent('http://152.179.12.86:3128')
    })
      // TODO: check for errors here, add breaking case
      .then((response) => response.text())
      .then((data) => {
        const newJobs = this.scrapePageForJob(data);
        if (typeof newJobs === "undefined")
          throw new Error("Undefined list of new jobs!");
        if (jobData.length > 10) throw new Error("Lots of jobs");

        this.start += newJobs.length;
        jobData = [...jobData, ...newJobs];

        console.log(`Scraped the next ${newJobs.length} jobs!`);

        this.recursivelyGetJobPage(jobData);
      })
      .catch((err) => {
        console.log(err);
        console.log(jobData);
        return jobData;
      });
  }

  getAllJobs() {
    return this.recursivelyGetJobPage([], this.keyword);
  }
}

const getAllJobsForKeyword = (keyword) => {
  const iq = new IndeedQuery({
    keyword,
  });

  const jobs = iq.getAllJobs();
  console.log(jobs);
};

getAllJobsForKeyword("software engineer");
