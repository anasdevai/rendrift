require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve processed and raw videos
app.use('/uploads/processed', express.static(path.join(__dirname, 'uploads/processed')));
app.use('/uploads/raw', express.static(path.join(__dirname, 'uploads/raw')));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const renderRouter = require('./routes/render');
const filesRouter = require('./routes/files');

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/render', renderRouter);
app.use('/uploads', filesRouter);

app.use((err, req, res, next) => {
    console.error('Unhandled request error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Processor server running on port ${PORT}`);
});
