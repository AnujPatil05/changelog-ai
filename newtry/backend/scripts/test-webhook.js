const fetch = require('node-fetch');

const webhookUrl = 'http://localhost:3001/webhook/github';

const pushEvent = {
    ref: 'refs/heads/main',
    repository: {
        name: 'test-repo',
        full_name: 'test-user/test-repo',
        owner: {
            login: 'test-user'
        }
    },
    commits: [
        {
            id: '999111',
            message: 'feat: implement **Dark Mode** support for all pages',
            timestamp: new Date().toISOString()
        },
        {
            id: '999222',
            message: 'feat: add **API Key Management** settings',
            timestamp: new Date().toISOString()
        },
        {
            id: '999333',
            message: 'fix: resolve crash on mobile safari',
            timestamp: new Date().toISOString()
        },
        {
            id: '999444',
            message: 'chore: update dependency versions', // Should be ignored/grouped
            timestamp: new Date().toISOString()
        }
    ]
};

fetch(webhookUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-github-event': 'push'
    },
    body: JSON.stringify(pushEvent)
})
    .then(res => {
        console.log('Status:', res.status);
        return res.text();
    })
    .then(body => console.log('Body:', body))
    .catch(err => console.error(err));
