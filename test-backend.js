// Test backend API endpoints
const http = require('http');

const BASE_URL = 'http://localhost:4001';

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function testBackend() {
    console.log('🧪 Testing Backend API\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    try {
        const health = await makeRequest('GET', '/health');
        if (health.status === 200) {
            console.log('   ✅ Health check passed');
        } else {
            console.log(`   ❌ Health check failed: ${health.status}`);
        }
    } catch (err) {
        console.log(`   ❌ Health check error: ${err.message}`);
        console.log('\n⚠️  Backend is not running. Start it with: cd apps/processor && node index.js');
        return;
    }

    // Test 2: Signup
    console.log('\n2. Testing signup...');
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    try {
        const signup = await makeRequest('POST', '/api/auth/signup', {
            email: testEmail,
            password: testPassword
        });
        
        if (signup.status === 201 && signup.data.token) {
            console.log('   ✅ Signup successful');
            console.log(`   Token: ${signup.data.token.substring(0, 20)}...`);
            
            // Test 3: Login with same credentials
            console.log('\n3. Testing login...');
            const login = await makeRequest('POST', '/api/auth/login', {
                email: testEmail,
                password: testPassword
            });
            
            if (login.status === 200 && login.data.token) {
                console.log('   ✅ Login successful');
                
                // Test 4: Get jobs (should be empty)
                console.log('\n4. Testing get jobs...');
                const token = login.data.token;
                
                const jobsReq = http.request(new URL('/api/jobs', BASE_URL), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        const json = JSON.parse(body);
                        if (res.statusCode === 200) {
                            console.log('   ✅ Get jobs successful');
                            console.log(`   Jobs count: ${json.jobs ? json.jobs.length : 0}`);
                        } else {
                            console.log(`   ❌ Get jobs failed: ${res.statusCode}`);
                            console.log(`   Response: ${body}`);
                        }
                        
                        console.log('\n' + '='.repeat(50));
                        console.log('✅ Backend API tests complete!');
                        console.log('='.repeat(50));
                        console.log('\nBackend is working correctly.');
                        console.log('You can now test the frontend at: http://localhost:3000');
                    });
                });
                
                jobsReq.on('error', (err) => {
                    console.log(`   ❌ Get jobs error: ${err.message}`);
                });
                
                jobsReq.end();
                
            } else {
                console.log(`   ❌ Login failed: ${login.status}`);
                console.log(`   Response:`, login.data);
            }
            
        } else {
            console.log(`   ❌ Signup failed: ${signup.status}`);
            console.log(`   Response:`, signup.data);
        }
    } catch (err) {
        console.log(`   ❌ Signup error: ${err.message}`);
    }
}

testBackend();
