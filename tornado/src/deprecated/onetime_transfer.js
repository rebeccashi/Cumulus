import fs from "fs";

import { uuid } from "../util/util.js";

const files = fs.readdirSync("./output");
const totalLength = files.length;
let shift = 0;
files.forEach((file, index) => {
  process.stdout.write(
    `Transforming skill ${index - shift}/${totalLength - shift}\r`
  );
  const data = JSON.parse(fs.readFileSync(`./output/${file}`, "utf-8"));
  const newData = {};

  newData.name = data.skill;
  newData.copies = [];
  if (Object.keys(data.timeseries).length == 0) {
    // no data object
    shift++;
    return;
  } else {
    // has data object
    [
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ].forEach((month, index) => {
      const monthObject = {
        date: `${((10 + index) % 12) + 1}-${2020 + (index > 1 ? 1 : 0)}`,
        numJobs: data.timeseries[month],
        titles: [],
        companies: [],
      };

      if (index == 11) {
        monthObject.titles = Object.keys(data.titles)
          .map((key) => {
            return {
              name: key,
              numJobs: data.titles[key],
            };
          })
          .sort((a, b) => b.numJobs - a.numJobs);

        monthObject.companies = Object.keys(data.companies)
          .map((key) => {
            return {
              name: key,
              numJobs: data.companies[key],
            };
          })
          .sort((a, b) => b.numJobs - a.numJobs);
      }

      newData.copies.unshift(monthObject);
    });

    fs.writeFileSync(`./db/skills/${uuid(50)}`, JSON.stringify(newData), {
      flag: "wx",
    });
  }
});
