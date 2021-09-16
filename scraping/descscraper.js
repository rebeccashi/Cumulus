import fetch from 'node-fetch';
import fs from 'fs';
import HttpsProxyAgent from 'https-proxy-agent';

let file = fs.readFileSync("data/input/plaintext/top1000ids",'utf8');

let fetches = [];
let desc = [];
let cleanData = [];

const NUM_START = 369;

let fileArr = file.split('\n\n');

// fileArr = ['edce7207f2e3612d'];

for (let i = NUM_START; i < fileArr.length; i++) {
  fetches.push(
  new Promise((resolve, reject) => {
    setTimeout(resolve, (i-NUM_START)*500);
  }).then(() => {
  fetch('https://www.indeed.com/viewjob?jk=' + fileArr[i], {
    agent: new HttpsProxyAgent('http://152.179.12.86:3128')
  })
  .then(response => response.text())
  .then(data => {

    console.log()

    if (data.indexOf('Captcha') >= 0) {
      fs.writeFileSync('data/output/json/descriptions4.json', JSON.stringify(desc));
      console.log(`failed at ${i}`);
      // exit();
    }

    console.log(`success on ${i}`);

    // let salarycatcher = /<div class="jobsearch-JobDescriptionSection-sectionItemKey icl-u-textBold">(.*)<\/div>/g;
    let salarycatcher = /window\._initialData=JSON\.parse\('\{(.*)\}'\);<\/script>/g;
    match = salarycatcher.exec(data);

    // while (match != null) {
    //   // matched text: match[0]
    //   // match start: match.index
    //   // capturing group n: match[n]
    // fs.writeFileSync('data/output/json/testjson', match[0]);
    //   console.log(match[0].substr(0,100))
    //   match = salarycatcher.exec(data);
    // }

    data = match[0];

    data = data.replace(/\\x22/g, '"')
                .replace(/\\x26/g, '&')
                .replace(/\\x27/g, '\'')
                .replace(/\\x3c/g, '<')
                .replace(/\\x3d/g, '=')
                .replace(/\\x3e/g, '>')
                .replace(/\\\\/g, '\\')
                .replace(/window\._initialData=JSON\.parse\('/g, '')
                .replace(/'\);<\/script>/g, '')
                .replace(/\\n/g, "\\n")  
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f")
                .replace(/[\u0000-\u0019]+/g,""); 

    let dataobj = JSON.parse(data);

    desc.push({
      id: dataobj.jobKey,
      title: dataobj.jobInfoWrapperModel?.jobInfoModel?.jobInfoHeaderModel?.jobTitle,
      company: dataobj.jobInfoWrapperModel?.jobInfoModel?.jobInfoHeaderModel?.companyName,
      location: dataobj.jobInfoWrapperModel?.jobInfoModel?.jobInfoHeaderModel?.formattedLocation,
      qualifications: dataobj.jobDescriptionSectionModel?.qualificationsSectionModel?.content || dataobj.jobInfoWrapperModel?.jobInfoModel?.jobDescriptionSectionModel?.qualificationsSectionModel?.content,
      type: dataobj.jobInfoWrapperModel?.jobInfoModel?.screenerRequirementsModel?.jobType ? dataobj.jobInfoWrapperModel?.jobInfoModel?.screenerRequirementsModel?.jobType["Job Type:"] : null,
      salary: dataobj.jobInfoWrapperModel?.jobInfoModel?.screenerRequirementsModel?.salaryInfoModel ? dataobj.jobInfoWrapperModel?.jobInfoModel?.screenerRequirementsModel?.salaryInfoModel["Salary:"]?.salaryText : null,
      description: dataobj.jobInfoWrapperModel?.jobInfoModel?.sanitizedJobDescription.content
    });




    // data = data.split(`class="jobsearch-jobDescriptionText">`);

    // console.log(data.length);

    // if (data.length === 1) console.log(i);
    
    // data.forEach((d,i) => {
    //   if (i === 0) return;

    //   desc.push(d.split(`</div>`)[0]
    //     .replace(/<ul style="list-style-type:circle;margin-top: 0px;margin-bottom: 0px;padding-left:20px;"> \n/g, '')
    //     .replace(/<li>/g, '')
    //     .replace(/<\/li>/g, '')
    //     .replace(/<\/ul>/g, '')
    //     .replace(/<b>/g, '')
    //     .replace(/<\/b>/g, '')
    //     .replace(/<p>/g, '')
    //     .replace(/<\/p>/g, '')
    //     .replace(/<li style="margin-bottom:0px;">/g, '')
    //     .replace(/\n/g, '')
    //     );
    // });
  })
  .catch(err => {
    fs.writeFileSync('data/output/json/descriptions4.json', JSON.stringify(desc));
    console.log(err);
  })
}))
}

Promise.all(fetches)
  .then(e => {
    fs.writeFileSync('data/output/json/descriptions4.json', JSON.stringify(desc));
  });