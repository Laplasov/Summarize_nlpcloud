const fs = require('fs');
const NLPCloudClient = require('nlpcloud');
const client = new NLPCloudClient('bart-large-cnn','76415ea76fb9eabb99ad0900ab148d54dd12c334');

fs.readFile('usearch_3.json', 'utf8', (err, data) => {
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
        fs.appendFile(`responses/response_3.json`, JSON.stringify(responseData) + ',\n', (err) => {
          if (err) throw err;
          console.log(`Response saved to file response_3.json`);
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