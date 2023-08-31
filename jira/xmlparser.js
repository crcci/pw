const fs = require('fs');
const { parseString } = require('xml2js');

function parseTestResults(xmlFilePath) {
  return new Promise((resolve, reject) => {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');

    parseString(xmlData, function(err, result) {
      if (err) {
        console.error('Error parsing XML:', err);
        reject(err);
        return;
      }

      const failedTestCases = [];

      if (result.testsuites && result.testsuites.testsuite) {
        const testSuites = result.testsuites.testsuite;
        for (const testsuite of testSuites) {
          if (testsuite.testcase) {
            for (const testcase of testsuite.testcase) {
              if (testcase.failure || testcase['system-out']) {
                let testName = extractTestName(testcase.$.name);
                console.log('Test name:', testName);
                const testId = extractTestId(testName);
                console.log('Test ID:', testId);
                testName = testName.replace(/Test-ID:\d+/, '').trim();

                const attachments = [];

                const cdataContent =
                  testcase['system-out'] ? testcase['system-out'][0] : null;

                if (cdataContent) {
                  const attachmentPaths = cdataContent.match(
                    /\[\[ATTACHMENT\|(.*?)]]/g
                  );

                  if (attachmentPaths) {
                    for (const attachmentPath of attachmentPaths) {
                      if (attachmentPath.includes('-retry1')) {
                        const attachmentInfo = {
                          path: attachmentPath.replace(
                            /\[\[ATTACHMENT\|(.*)]]/,
                            '$1'
                          ),
                        };
                        attachments.push(attachmentInfo);
                      }
                    }
                  }
                }

                failedTestCases.push({
                  test_id: testId,
                  name: testName,
                  attachments: attachments.map(attachment => ({
                    path: attachment.path.replace('../', '')
                  })),
                });
              }
            }
          }
        }
      }

      const jsonOutput = JSON.stringify(
        { failed_test_cases: failedTestCases },
        null,
        2
      );

      fs.writeFileSync('jira/failed_test_cases.json', jsonOutput);
      console.log('JSON file with failed test cases and attachments created.');

      resolve({ failed_test_cases: failedTestCases });
    });
  });
}

function extractTestName(fullName) {
  const matches = fullName.match(/›\s*([^@]+)\s*@/);
  return matches ? matches[1].trim() : fullName;
}

function extractTestId(testName) {
  const matches = testName.match(/Test-ID:(\d+)/);
  const result = matches ? matches[1] : 'Unknown';
  return result;
}

module.exports = { parseTestResults };
