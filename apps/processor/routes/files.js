const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../lib/middleware');
const db = require('../db/init');

// Serve processed video files
router.get('/processed/:filename', authMiddleware, (req, res) => {
    const { filename } = req.params;
    const jobId = filename.replace('.mp4', '');
    
    // Verify job belongs to user
    const job = db.prepare('SELECT * FROM jobs WHERE id = ? AND user_id = ?').get(jobId, req.user.id);
    
    if (!job) {
        return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(__dirname, '../uploads/processed', filename);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
});

module.exports = router;
