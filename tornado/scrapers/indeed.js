import fetch from 'node-fetch';
import cheerio from 'cheerio';

console.log("Scraping Indeed!");

class IndeedQuery {
  constructor({
    keyword = "",
    city = "",
    radius = "25",
    level = "",
    maxAge = "",
    sort = "",
    jobType = ""
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
  }

  // we use a recursive strategy to get every page
  recursivelyGetJobPage(jobData, keyword) {
    fetch(this.url(), {
      // agent: new HttpsProxyAgent('http://152.179.12.86:3128')
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
    });
  }

  getAllJobs() {
    return this.recursivelyGetJobPage({}, this.keyword)
  }
}

const getAllJobsForKeyword = (keyword) => {
  const iq = new IndeedQuery({
    keyword
  })

  const jobs = iq.getAllJobs();
}

getAllJobsForKeyword("software engineer");