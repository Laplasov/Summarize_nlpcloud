const fs = require('fs');
const NLPCloudClient = require('nlpcloud');
const client = new NLPCloudClient('bart-large-cnn','772ddde61810936cab554750a2bcfb3079f281b6');

fs.readFile('usearch_4.json', 'utf8', (err, data) => {
  if (err) throw err;
  
  const jsonData = JSON.parse(data);
  let i = 0;
  
  if (!fs.existsSync('responses')) {
    fs.mkdirSync('responses');
  }
  
  const makeRequest = () => {
    client.summarization(jsonData[i].body)
      .then(function (response) {
        const responseData = response.data;
        fs.appendFile(`responses/response_4.json`, JSON.stringify(responseData) + ',\n', (err) => {
          if (err) throw err;
          console.log(`Response saved to file response_4.json`);
          i++;
          if (i < jsonData.length) {
            setTimeout(makeRequest, 9000);
          }
        });
      })
      .catch(function (err) {
        console.error(err.response.status);
        console.error(err.response.data.detail);
        setTimeout(makeRequest, 20000);
      });
  };
  
  makeRequest();
});