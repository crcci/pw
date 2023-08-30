import fetch from './fetchWrapper.mjs';
import {parseTestResults}  from './xmlparser.js'
import { passwordToken } from './settings.mjs';


// parseTestResults('outcome/test-results/results.xml').then((testResults) => {
//   console.log(testResults);
// });


const username = 'johnnurcan@gmail.com';
const password = passwordToken;
const jiraInstance = 'https://platformqa.atlassian.net';
const projectKeys = "QA"


async function searchJira() {
    const jql = `project = "QA" AND issuetype = Bug AND status != Done AND "test-id" = 1`;
    const url = `${jiraInstance}//rest/api/3/search?jql=${jql}`
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(username + ":" + password).toString('base64')}`,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.json();
    })
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

searchJira();