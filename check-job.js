// Check the latest job in the database
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'apps/processor/db/focuscast.db');
const db = new Database(dbPath);

console.log('🔍 Checking latest job...\n');

const job = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC LIMIT 1').get();

if (job) {
    console.log('Job Details:');
    console.log('  ID:', job.id);
    console.log('  Status:', job.status);
    console.log('  Current Step:', job.current_step);
    console.log('  Input Path:', job.input_path);
    console.log('  Output Path:', job.output_path || '(null)');
    console.log('  Error:', job.error_message || '(none)');
    console.log('  Created:', job.created_at);
    console.log('  Updated:', job.updated_at);
    
    if (job.output_path) {
        const fs = require('fs');
        const exists = fs.existsSync(job.output_path);
        console.log('\n  Output file exists:', exists ? '✅ Yes' : '❌ No');
        
        if (exists) {
            const stats = fs.statSync(job.output_path);
            console.log('  File size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
        }
    } else {
        console.log('\n⚠️  Output path is NULL - video may not have been rendered');
    }
} else {
    console.log('No jobs found in database');
}

db.close();
