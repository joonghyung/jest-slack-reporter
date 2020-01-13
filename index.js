const readPkg = require('read-pkg');
const request = require('request');

module.exports = testResults => {
  const packagedData = readPkg.sync(process.cwd());
  const config = packagedData.jestSlackReporter || {};

  const webhookUrl = config.webhookUrl;
  if (!webhookUrl) {
    throw new Error("Please add a slack webhookUrl field under jestSlackReporter on your package.json");
  }

  //console.log( JSON.stringify(testResults) );
  if( testResults.numFailedTests > 0){

    var msg = testResults.testResults[0].testResults[0].failureMessages[0];
    var n1 = msg.indexOf("@@@");
    var n2 = msg.lastIndexOf("@@@");
    const errText = msg.substring(n1+3, n2);
  
    //console.log("send slack api " + webhookUrl + " " + errText );

    const options = {
      uri: webhookUrl,
      method: 'POST',
      json: {
        "attachments": [ 
            {
                "fields": [
                    {
                        "title": "[NEW]",
                        "value": errText
                    }
                ],
                "color": "#F35A00"
            }
        ]
      },
      mrkdwn: true,
    };

    var promise1 = function () {
      return new Promise(function (resolve, reject) {
        // async
        request.post(options, function (err, httpResponse, body) {
          console.log( JSON.stringify(httpResponse));
          resolve("1");
        });
      });
    };

    Promise.all([promise1()]).then(function (values) {
      //console.log("completed...", values);
      return testResults;
    });
  }

  return testResults;
};
