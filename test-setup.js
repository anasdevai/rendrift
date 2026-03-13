// Quick setup verification script
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 FocusCast AI - Setup Verification\n');

// Check 1: Node modules
console.log('1. Checking Node.js dependencies...');
const processorPackage = path.join(__dirname, 'apps/processor/node_modules');
const webPackage = path.join(__dirname, 'apps/web/node_modules');

if (fs.existsSync(processorPackage)) {
    console.log('   ✅ Backend dependencies installed');
} else {
    console.log('   ❌ Backend dependencies missing. Run: cd apps/processor && npm install');
}

if (fs.existsSync(webPackage)) {
    console.log('   ✅ Frontend dependencies installed');
} else {
    console.log('   ❌ Frontend dependencies missing. Run: cd apps/web && npm install');
}

// Check 2: Python venv
console.log('\n2. Checking Python environment...');
const venvPath = path.join(__dirname, 'apps/processor/agent/.venv');
if (fs.existsSync(venvPath)) {
    console.log('   ✅ Python virtual environment exists');
} else {
    console.log('   ❌ Python venv missing. Run: cd apps/processor/agent && uv sync');
}

// Check 3: Environment files
console.log('\n3. Checking environment configuration...');
const processorEnv = path.join(__dirname, 'apps/processor/.env');
const webEnv = path.join(__dirname, 'apps/web/.env.local');

if (fs.existsSync(processorEnv)) {
    const envContent = fs.readFileSync(processorEnv, 'utf8');
    if (envContent.includes('OPENROUTER_API_KEY')) {
        console.log('   ✅ Backend .env configured');
    } else {
        console.log('   ⚠️  Backend .env missing OPENROUTER_API_KEY');
    }
} else {
    console.log('   ❌ Backend .env missing');
}

if (fs.existsSync(webEnv)) {
    console.log('   ✅ Frontend .env.local configured');
} else {
    console.log('   ⚠️  Frontend .env.local missing (optional)');
}

// Check 4: Database
console.log('\n4. Checking database...');
const dbPath = path.join(__dirname, 'apps/processor/db/focuscast.db');
if (fs.existsSync(dbPath)) {
    console.log('   ✅ Database file exists');
} else {
    console.log('   ⚠️  Database will be created on first run');
}

// Check 5: Upload directories
console.log('\n5. Checking upload directories...');
const rawDir = path.join(__dirname, 'apps/processor/uploads/raw');
const processedDir = path.join(__dirname, 'apps/processor/uploads/processed');

if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
    console.log('   ✅ Created uploads/raw directory');
} else {
    console.log('   ✅ uploads/raw directory exists');
}

if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
    console.log('   ✅ Created uploads/processed directory');
} else {
    console.log('   ✅ uploads/processed directory exists');
}

// Check 6: Test server connectivity
console.log('\n6. Testing server connectivity...');

function checkServer(port, name) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}/health`, (res) => {
            if (res.statusCode === 200) {
                console.log(`   ✅ ${name} is running on port ${port}`);
                resolve(true);
            } else {
                console.log(`   ⚠️  ${name} responded with status ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', () => {
            console.log(`   ❌ ${name} is not running on port ${port}`);
            resolve(false);
        });
        
        req.setTimeout(2000, () => {
            req.destroy();
            console.log(`   ❌ ${name} connection timeout on port ${port}`);
            resolve(false);
        });
    });
}

async function checkServers() {
    const agentRunning = await checkServer(8000, 'Python Agent');
    const backendRunning = await checkServer(4001, 'Node.js Backend');
    
    console.log('\n' + '='.repeat(50));
    console.log('Setup Verification Complete!');
    console.log('='.repeat(50));
    
    if (!agentRunning || !backendRunning) {
        console.log('\n⚠️  Some services are not running.');
        console.log('\nTo start all services, run:');
        console.log('  Windows: start-all.bat');
        console.log('  Or manually in 3 terminals:');
        console.log('    Terminal 1: cd apps/processor/agent && uv run uvicorn main:app --host 0.0.0.0 --port 8000');
        console.log('    Terminal 2: cd apps/processor && node index.js');
        console.log('    Terminal 3: cd apps/web && npm run dev');
    } else {
        console.log('\n✅ All services are running!');
        console.log('\nAccess the application at:');
        console.log('  Frontend: http://localhost:3000');
        console.log('  Backend API: http://localhost:4001');
        console.log('  Python Agent: http://localhost:8000');
    }
}

checkServers();
