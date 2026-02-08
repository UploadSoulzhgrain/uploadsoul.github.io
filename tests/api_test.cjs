
const http = require('http');

function testEndpoint(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`\n[${method}] ${path}: ${res.statusCode}`);
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const json = JSON.parse(data);
                        console.log('Response (JSON):', JSON.stringify(json, null, 2));
                        resolve(true);
                    } else {
                        console.error('Error Response (Text):', data);
                        resolve(false);
                    }
                } catch (e) {
                    console.error('Invalid JSON:', data);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request error: ${e.message}`);
            resolve(false);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('Testing Backend Simulator Endpoints...');

    // 1. Test Speech Token
    await testEndpoint('/api/speech-token');

    // 2. Test ICE Servers
    await testEndpoint('/api/ice-servers');

    // 3. Test Chat (Mock)
    await testEndpoint('/api/chat', 'POST', { message: 'Hello' });
}

runTests();
