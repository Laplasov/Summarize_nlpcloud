const { OneAI } = require("oneai");
const fs = require("fs");
const path = require("path");

const oneai = new OneAI("8653115f-d13e-4c41-88b3-7f0636f62ba8");

const directoryPath = ".";
const newDirectory = "new_directory";
const summaryFileName = "summary.json";

fs.readdir(directoryPath, (err, files) => {
if (err) {
console.error(err);
return;
}

const jsonFiles = files.filter((file) => file.endsWith(".json"));

fs.mkdir(newDirectory, { recursive: true }, (err) => {
if (err) {
console.error(err);
return;
}
jsonFiles.forEach((file) => {
  const filePath = path.join(directoryPath, file);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const fileData = JSON.parse(data);
    const allSummaries = [];

    for (const value of fileData.value) {
      const text = value.body;
      const pipeline = new oneai.Pipeline(
        oneai.skills.summarize()
      );

      pipeline.run(text).then((response) => {
        const { summary } = response;
        const summaryText = summary.text;
        allSummaries.push(summaryText);

        fs.appendFile(path.join(newDirectory, summaryFileName), JSON.stringify({ summary: summaryText }) + ',\n', "utf-8", (err) => {
          if (err) {
            console.error(err);
            return;
          }

          console.log(`The summary for ${file} has been appended to ${path.join(newDirectory, summaryFileName)}`);
        });
      });
    }
  });
});
});
});