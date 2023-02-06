const NLPCloudClient = require('nlpcloud');

const client = new NLPCloudClient('bart-large-cnn','4ee0a8e574182780987c5acc5f4e5a3f4de49cbf')
client.summarization(`text`).then(function (response) {
    console.log(response.data);
  })
  .catch(function (err) {
    console.error(err.response.status);
    console.error(err.response.data.detail);
  });
