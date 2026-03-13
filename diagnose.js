// Comprehensive diagnostic script
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 FocusCast AI - Diagnostic Tool\n');
console.log('='.repeat(60));

// Check 1: Environment files
console.log('\n📄 1. Checking Environment Files...');
const backendEnv = path.join(__dirname, 'apps/processor/.env');
const frontendEnv = path.join(__dirname, 'apps/web/.env.local');

if (fs.existsSync(backendEnv)) {
    const content = fs.readFileSync(backendEnv, 'utf8');
    console.log('   ✅ Backend .env exists');
    const port = content.match(/PORT=(\d+)/);
    if (port) {
        console.log(`   📌 Backend PORT: ${port[1]}`);
    }
    const hasApiKey = content.includes('OPENROUTER_API_KEY');
    console.log(`   ${hasApiKey ? '✅' : '❌'} OPENROUTER_API_KEY: ${hasApiKey ? 'Set' : 'Missing'}`);
} else {
    console.log('   ❌ Backend .env missing');
}

if (fs.existsSync(frontendEnv)) {
    const content = fs.readFileSync(frontendEnv, 'utf8');
    console.log('   ✅ Frontend .env.local exists');
    const serverUrl = content.match(/NEXT_PUBLIC_SERVER_URL=(.*)/);
    if (serverUrl) {
        console.log(`   📌 Frontend API URL: ${serverUrl[1].trim()}`);
    }
} else {
    console.log('   ⚠️  Frontend .env.local missing (will use default)');
}

// Check 2: Database
console.log('\n💾 2. Checking Database...');
const dbPath = path.join(__dirname, 'apps/processor/db/focuscast.db');
if (fs.existsSync(dbPath)) {
    console.log('   ✅ Database file exists');
    try {
        const Database = require('better-sqlite3');
        const db = new Database(dbPath);
        
        // Check tables
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        console.log(`   📊 Tables: ${tables.map(t => t.name).join(', ')}`);
        
        // Check jobs table schema
        const jobsSchema = db.prepare("PRAGMA table_info(jobs)").all();
        const columns = jobsSchema.map(c => c.name);
        console.log(`   📋 Jobs columns: ${columns.join(', ')}`);
        
        const hasCurrentStep = columns.includes('current_step');
        console.log(`   ${hasCurrentStep ? '✅' : '❌'} current_step column: ${hasCurrentStep ? 'Present' : 'Missing'}`);
        
        if (!hasCurrentStep) {
            console.log('   ⚠️  Run: node apps/processor/db/migrate.js');
        }
        
        db.close();
    } catch (err) {
        console.log(`   ❌ Database error: ${err.message}`);
    }
} else {
    console.log('   ❌ Database file missing');
    console.log('   ⚠️  Will be created on first server start');
}

// Check 3: FFmpeg
console.log('\n🎬 3. Checking FFmpeg...');
const { execSync } = require('child_process');
try {
    const ffmpegVersion = execSync('ffmpeg -version', { encoding: 'utf8' });
    const versionMatch = ffmpegVersion.match(/ffmpeg version ([^\s]+)/);
    if (versionMatch) {
        console.log(`   ✅ FFmpeg installed: ${versionMatch[1]}`);
    } else {
        console.log('   ✅ FFmpeg installed (version unknown)');
    }
} catch (err) {
    console.log('   ❌ FFmpeg not found');
    console.log('   ⚠️  Install from: https://www.gyan.dev/ffmpeg/builds/');
    console.log('   ⚠️  Add to PATH: C:\\ffmpeg\\bin');
}

// Check 4: Node modules
console.log('\n📦 4. Checking Dependencies...');
const backendModules = path.join(__dirname, 'apps/processor/node_modules');
const frontendModules = path.join(__dirname, 'apps/web/node_modules');
const agentVenv = path.join(__dirname, 'apps/processor/agent/.venv');

console.log(`   ${fs.existsSync(backendModules) ? '✅' : '❌'} Backend node_modules`);
console.log(`   ${fs.existsSync(frontendModules) ? '✅' : '❌'} Frontend node_modules`);
console.log(`   ${fs.existsSync(agentVenv) ? '✅' : '❌'} Python virtual environment`);

// Check 5: Server connectivity
console.log('\n🌐 5. Checking Server Connectivity...');

async function checkPort(port, name) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}/health`, (res) => {
            if (res.statusCode === 200) {
                console.log(`   ✅ ${name} running on port ${port}`);
                resolve(true);
            } else {
                console.log(`   ⚠️  ${name} responded with status ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', () => {
            console.log(`   ❌ ${name} not running on port ${port}`);
            resolve(false);
        });
        
        req.setTimeout(2000, () => {
            req.destroy();
            console.log(`   ❌ ${name} timeout on port ${port}`);
            resolve(false);
        });
    });
}

async function runConnectivityTests() {
    const pythonRunning = await checkPort(8000, 'Python Agent');
    const backendRunning = await checkPort(4001, 'Node.js Backend');
    
    // Try to test backend API if it's running
    if (backendRunning) {
        console.log('\n🧪 6. Testing Backend API...');
        
        // Test signup
        const testEmail = `test${Date.now()}@example.com`;
        const postData = JSON.stringify({
            email: testEmail,
            password: 'test123'
        });
        
        const options = {
            hostname: 'localhost',
            port: 4001,
            path: '/api/auth/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 201) {
                    console.log('   ✅ Signup endpoint working');
                    try {
                        const data = JSON.parse(body);
                        if (data.token) {
                            console.log('   ✅ JWT token generation working');
                        }
                    } catch (e) {
                        console.log('   ⚠️  Response parsing failed');
                    }
                } else {
                    console.log(`   ❌ Signup failed with status ${res.statusCode}`);
                    console.log(`   Response: ${body}`);
                }
                
                printSummary(pythonRunning, backendRunning);
            });
        });
        
        req.on('error', (err) => {
            console.log(`   ❌ API test error: ${err.message}`);
            printSummary(pythonRunning, backendRunning);
        });
        
        req.write(postData);
        req.end();
    } else {
        printSummary(pythonRunning, backendRunning);
    }
}

function printSummary(pythonRunning, backendRunning) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSTIC SUMMARY');
    console.log('='.repeat(60));
    
    if (!pythonRunning && !backendRunning) {
        console.log('\n⚠️  NO SERVICES RUNNING');
        console.log('\nTo start all services:');
        console.log('  1. Terminal 1: cd apps/processor/agent && uv run uvicorn main:app --host 0.0.0.0 --port 8000');
        console.log('  2. Terminal 2: cd apps/processor && node index.js');
        console.log('  3. Terminal 3: cd apps/web && npm run dev');
        console.log('\nOr use: start-all.bat');
    } else if (!backendRunning) {
        console.log('\n⚠️  Node.js Backend is not running');
        console.log('\nStart it with: cd apps/processor && node index.js');
    } else if (!pythonRunning) {
        console.log('\n⚠️  Python Agent is not running');
        console.log('\nStart it with: cd apps/processor/agent && uv run uvicorn main:app --host 0.0.0.0 --port 8000');
    } else {
        console.log('\n✅ ALL SERVICES RUNNING');
        console.log('\nYou can now:');
        console.log('  1. Start frontend: cd apps/web && npm run dev');
        console.log('  2. Access app: http://localhost:3000');
    }
    
    console.log('\n' + '='.repeat(60));
}

runConnectivityTests();
