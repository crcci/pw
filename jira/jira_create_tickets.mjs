import fetch from './fetchWrapper.mjs';
import {parseTestResults}  from './xmlparser.js'
import { passwordToken } from './settings.mjs';
import fs from 'fs';

const username = 'johnnurcan@gmail.com';
const password = passwordToken;
const jiraInstance = 'https://platformqa.atlassian.net';
const projectKey = "QA"

async function processTestResults(testResults) {
    for (const testCase of testResults.failed_test_cases) {
        const testId = testCase.test_id;
        const testName = testCase.name;
        const attachments = testCase.attachments;

        console.log(`Processing test case: ${testName}`);
        const issue = await findIssueByTestId(testId);
        if (issue) {
            console.log(`Found existing issue with key: ${issue.key}`);
        } else {
            console.log('No existing issue found. Creating a new issue...');
            const newIssue = await createJiraTicket(testName, testName, testId);
            console.log(`Created issue with key: ${newIssue.key}`);
            for (const attachment of attachments) {
                console.log(`Attaching file: ${attachment.path}`);
                await attachFileToIssue(newIssue.id, attachment.path);
            }
            console.log('All files attached successfully');
        }
    }
}

async function findIssueByTestId(testId) {
    const jql = `project = "${projectKey}" AND "test-id" = "${testId}"`;
    const url = `${jiraInstance}/rest/api/3/search?jql=${encodeURIComponent(jql)}`;
    const headers = {
        'Authorization': `Basic ${Buffer.from(username + ":" + password).toString('base64')}`,
        'Accept': 'application/json'
    };

    try {
        const response = await fetch(url, {method: 'GET', headers: headers});
        const data = await response.json();
        return data.issues[0];
    } catch (error) {
        console.error(error);
    }
}

async function createJiraTicket(summary, description, testId) {
    const url = `${jiraInstance}/rest/api/3/issue`;
    const payload = {
        fields: {
            project: {
                key: projectKey
            },
            summary: summary,
            description: {
                type: "doc",
                version: 1,
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: description
                            }
                        ]
                    }
                ]
            },
            issuetype: {
                name: "Bug"
            },
            "customfield_10000": testId
        }
    };
    const headers = {
        'Authorization': `Basic ${Buffer.from(username + ":" + password).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(payload)});
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function attachFileToIssue(issueId, filePath) {
    const url = `${jiraInstance}/rest/api/3/issue/${issueId}/attachments`;
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = filePath.split('/').pop();
    const formData = new FormData();
    formData.append('file', fileBuffer, {filename: fileName});
    const headers = {
        ...formData.getHeaders(),
        'Authorization': `Basic ${Buffer.from(username + ":" + password).toString('base64')}`,
        'X-Atlassian-Token': 'no-check'
    };

    try {
        await fetch(url, {method: 'POST', headers: headers, body: formData});
    } catch (error) {
        console.error(error);
    }
}

parseTestResults('outcome/test-results/results.xml').then((testResults) => {
  processTestResults(testResults);
});
