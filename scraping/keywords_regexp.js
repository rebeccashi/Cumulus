import fs from 'fs';

let text = fs.readFileSync("../data/input/json/descriptions.json").toString('utf-8');

let textobj = JSON.parse(text);

const programmingLanguages = ['Bash', 'C', 'C++', "C#", "CSS", 'Dreamweaver', 'Kotlin',  "Go", 'Golang',  'HTML', "Javascript", "Java", "Node" , "MySQL", "Objective-C", 'python', 'PERL', 'php', 'qt', 'sql', 'R', 'ruby', 'Ruby on Rails', 'Scala', 'Smalltalk', 'mySQL', 'postgres', 'postgresql', 'graphql', 'mongodb', 'Swift', 'jQuery', 'Matlab', 'React', 'aws', 'typescript', ];
const languagesData = {};
const jobData = [];

programmingLanguages.map((language) => {
  languagesData[language] = 0;
})

//C: case sensitive

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

textobj.forEach(job => {
  let langs = {};

  programmingLanguages.forEach((language, i) => {
var loop = true;
    let index = 0, nextChar = '';
    //case sensitive
    if (language == 'C' || language == 'C++' || language == 'R') {
        while (loop) {
            index = text.indexOf(language, index)   
            if (index == -1) break;
            nextChar = text.slice(index+1, index+2);
            // console.log(nextChar)
            if (nextChar == ' ' || nextChar == ',' || nextChar == ':') {
                console.log(`${language}: ${index}`)
                languagesData[i].count++;
            }
            index += 1;
        }
    //case insensitive
    } else {
        // let stringCopy = text.repeat(1) 
        // while (loop) {
            
        //     index = stringCopy.search(new RegExp(language, "i"))
        //     if (index == -1) break;
        //     nextChar = text.slice(index+1, index+2);
        //     stringCopy = stringCopy.slice(index + 1);

        //     if (nextChar == ' ' || nextChar == ',' || nextChar == ':') {
        //         console.log(`${language}: ${index}`)
        //         languagesData[i].count++;
        //     }
        //     console.log(index);
        // }
        const arr1 = text.match(new RegExp(language.concat(','), "gi")) || [];
        const regex2 = new RegExp(language.concat(' '), "gi");
        const regex3 = new RegExp(language.concat(':'), "gi");
        const found = text.match(regex1).concat(text.match(regex2)).concat(text.match(regex3));
        console.log(found)
        languagesData[i].count = found? found.length: 0;
    }
})
});

// programmingLanguages.forEach((language, i) => {
//   let regex = new RegExp(`(?:\\s|\\W|>)(${escapeRegExp(language)})(?:\\s|\\W|<)`, 'gmi');

//   if (language === 'C') regex = new RegExp(`(?:\\s|\\W|>)(C)(?:\\s|,|\\\\.|\\/|&|<)`, 'gmi');

//   console.log(text.match(regex));

//   languagesData.set(language, text.match(regex)?.length);
// })

console.log(languagesData);

fs.writeFileSync('../data/output/json/languagesData.json', JSON.stringify(languagesData));
fs.writeFileSync('../data/output/json/jobData.json', JSON.stringify(jobData));