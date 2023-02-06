const fs = require("fs");
const path = require("path");

fs.readdir("./", function(error, files) {
if (error) {
console.error(error);
return;
}

const jsonFiles = files.filter(file => path.extname(file) === ".json");

if (!fs.existsSync("Extracted")) {
fs.mkdirSync("Extracted");
}

jsonFiles.forEach(function(file) {
fs.readFile(file, "utf8", function(error, data) {
if (error) {
console.error(error);
return;
}


  const jsonData = JSON.parse(data);
  const bodies = jsonData.value.map(value => ({ body: value.body }));

  const content = JSON.stringify(bodies, null, 2);

  fs.writeFile(`Extracted/${path.basename(file)}`, content, function(err) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`${file} was processed and saved!`);
  });
});
});
});