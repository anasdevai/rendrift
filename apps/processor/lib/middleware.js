const { verifyToken } = require('../lib/auth');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('authMiddleware: Missing or invalid Authorization header');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
        console.warn('authMiddleware: Token verification failed');
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = payload;
    next();
}

module.exports = authMiddleware;
