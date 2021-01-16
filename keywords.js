const fs = require('fs');

var text = fs.readFileSync("top1000descriptions-2").toString('utf-8');

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

console.log(languagesData)

