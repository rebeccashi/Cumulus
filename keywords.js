const fs = require('fs');

var text = fs.readFileSync("top1000descriptions").toString('utf-8');

const programmingLanguages = ['Bash', 'C', 'C++', "C#", "CSS", 'Dreamweaver', 'Kotlin',  "Go", 'Golang',  'HTML', "Javascript", "Java", "Node.js" , "MySQL", "Objective-C", 'python', 'PERL', 'php', 'qt', 'sql', 'R', 'Ruby on Rails', 'Scala', 'Smalltalk', 'SQL', 'Swift', 'jQuery', 'Matlab'];
const languagesData = [];
// D

programmingLanguages.map( (language) => {
    const obj = {
        language: language,
        count: 0,
    };
    languagesData.push(obj);
})

//C: case sensitive

programmingLanguages.forEach ((language, i) => {
    var loop = true;
    let index = 0
    while (loop) {
        index = text.indexOf(language.concat(','), index)
        console.log(`${language}: ${index}`)
        if (index == -1) break;
        index += 1
        languagesData[i].count++;
    }
})

console.log(languagesData)

