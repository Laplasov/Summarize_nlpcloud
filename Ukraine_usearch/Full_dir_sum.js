const fs = require('fs');
const NLPCloudClient = require('nlpcloud');
const client = new NLPCloudClient('bart-large-cnn','365144c0b7afc38ab41752a53b520b6509261bec',true,'',true);

const makeRequest = (jsonData, i, index) => {
  client.summarization(jsonData[i].body)
    .then(function (response) {
      const responseData = response.data;
      fs.appendFile(`responses/response_${index}.json`, JSON.stringify(responseData) + ',\n', (err) => {
        if (err) throw err;
        console.log(`Response added to file response_${index}.json`);
      });
    })
    .catch(function (err) {
      if (err.response) {
      console.error(err.response.status);
      console.error(err.response.data.detail);
      // Call the function again in case of a failure with a 5-second delay
      setTimeout(() => {
        makeRequest(jsonData, i, index);
      }, 10000);} else {
        console.error(err);
      }
    });
};

const readAndProcessFile = (file, index) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err;
    
    const bodyData = JSON.parse(data);
    const jsonData = bodyData.value.map(value => ({ body: value.body }));
    for (let i = 0; i < jsonData.length; i++) {
      if (!jsonData[i].body) {
        console.error(`jsonData[${i}].body is undefined in file ${file}`);
        continue;
      }
      
      setTimeout(() => {
        makeRequest(jsonData, i, index);
      }, 2500);
    }
  });
};

fs.readdir('.', (err, files) => {
  if (err) throw err;
  
  if (!fs.existsSync('responses')) {
    fs.mkdirSync('responses');
  }
  
  let index = 1;
  for (const file of files) {
    if (file.endsWith('.json')) {
      readAndProcessFile(file, index);
      index++;
    }
  }
});
