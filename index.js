const fetch = require('node-fetch');
const fs = require('fs');
const HttpsProxyAgent = require('https-proxy-agent');

let desc = [];

let MAX_JOBS = 1000;
let SKIP_AMT = 10;
let num = 0;

let done = 0;

let fetches = [];

while (num < MAX_JOBS) {
  fetches.push(fetch('https://www.indeed.com/jobs?q=software+engineering+internship&l=new+york&start=' + num, {
    agent: new HttpsProxyAgent('http://152.26.66.140:3128')
  })
  .then(response => response.text())
  .then(data => {
    data = data.replace(/>\s</g, '><');
    data = data.split(`<div class="summary">`);

    console.log(data.length);
    
    data.forEach((d,i) => {
      if (i === 0) return;

      desc.push(d.split(`</div>`)[0]
        .replace(/<ul style="list-style-type:circle;margin-top: 0px;margin-bottom: 0px;padding-left:20px;"> \n/g, '')
        .replace(/<li>/g, '')
        .replace(/<\/li>/g, '')
        .replace(/<\/ul>/g, '')
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<li style="margin-bottom:0px;">/g, '')
        .replace(/\n/g, '')
        );
    });
  })
  .catch(err => {
    console.log(desc);
    console.log(err);
  }));

  num += SKIP_AMT;
}

Promise.all(fetches)
  .then(e => {
    desc2 = [...new Set(desc)];
    fs.writeFileSync('filedata3', desc2.join('\n\n'));
  });