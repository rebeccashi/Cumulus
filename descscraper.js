

const fetch = require('node-fetch');
const fs = require('fs');
const HttpsProxyAgent = require('https-proxy-agent');

let file = fs.readFileSync("./top1000ids",'utf8');

let fetches = [];
let desc = [];

const NUM_START = 0;

let fileArr = file.split('\n\n');

for (let i = NUM_START; i < fileArr.length; i++) {
  fetches.push(fetch('https://www.indeed.com/viewjob?jk=' + fileArr[i], {
    agent: new HttpsProxyAgent('http://152.26.66.140:3128')
  })
  .then(response => response.text())
  .then(data => {
    data = data.replace(/>\s</g, '><');
    data = data.split(`class="jobsearch-jobDescriptionText">`);

    console.log(data.length);

    if (data.length === 1) console.log(i);
    
    data.forEach((d,i) => {
      if (i === 0) return;

      desc.push(d.split(`</div>`)[0]
        .replace(/<ul style="list-style-type:circle;margin-top: 0px;margin-bottom: 0px;padding-left:20px;"> \n/g, '')
        .replace(/<li>/g, '')
        .replace(/<\/li>/g, '')
        .replace(/<\/ul>/g, '')
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '')
        .replace(/<li style="margin-bottom:0px;">/g, '')
        .replace(/\n/g, '')
        );
    });
  })
  .catch(err => {
    console.log(desc);
    console.log(err);
  }));
}

Promise.all(fetches)
  .then(e => {
    desc2 = [...new Set(desc)];
    fs.writeFileSync('top1000descriptions', desc2.join('\n\n'));
  });