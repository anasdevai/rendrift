const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'focuscast.db');

console.log('🔄 Migrating database schema...\n');

// Backup existing database
if (fs.existsSync(DB_PATH)) {
    const backupPath = path.join(__dirname, `focuscast.db.backup.${Date.now()}`);
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`✅ Backed up existing database to: ${backupPath}`);
}

const db = new Database(DB_PATH);

// Enable WAL mode
db.pragma('journal_mode = WAL');

// Check if current_step column exists
try {
    const tableInfo = db.prepare("PRAGMA table_info(jobs)").all();
    const hasCurrentStep = tableInfo.some(col => col.name === 'current_step');
    
    if (!hasCurrentStep) {
        console.log('⚠️  Missing current_step column, adding it...');
        db.exec(`ALTER TABLE jobs ADD COLUMN current_step TEXT NOT NULL DEFAULT 'queued'`);
        console.log('✅ Added current_step column');
    } else {
        console.log('✅ current_step column already exists');
    }
} catch (err) {
    console.error('❌ Error checking/adding current_step column:', err.message);
}

// Check if render_script column exists
try {
    const tableInfo = db.prepare("PRAGMA table_info(jobs)").all();
    const hasRenderScript = tableInfo.some(col => col.name === 'render_script');
    
    if (!hasRenderScript) {
        console.log('⚠️  Missing render_script column, adding it...');
        db.exec(`ALTER TABLE jobs ADD COLUMN render_script TEXT`);
        console.log('✅ Added render_script column');
    } else {
        console.log('✅ render_script column already exists');
    }
} catch (err) {
    console.error('❌ Error checking/adding render_script column:', err.message);
}

// Check if token_used column exists
try {
    const tableInfo = db.prepare("PRAGMA table_info(jobs)").all();
    const hasTokenUsed = tableInfo.some(col => col.name === 'token_used');
    
    if (!hasTokenUsed) {
        console.log('⚠️  Missing token_used column, adding it...');
        db.exec(`ALTER TABLE jobs ADD COLUMN token_used INTEGER DEFAULT 0`);
        console.log('✅ Added token_used column');
    } else {
        console.log('✅ token_used column already exists');
    }
} catch (err) {
    console.error('❌ Error checking/adding token_used column:', err.message);
}

// Verify final schema
console.log('\n📊 Final schema:');
const finalSchema = db.prepare("PRAGMA table_info(jobs)").all();
finalSchema.forEach(col => {
    console.log(`   - ${col.name} (${col.type})`);
});

db.close();

console.log('\n✅ Migration complete!');
console.log('\nYou can now restart the server with: node index.js');
