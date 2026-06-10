const { logRequest, logError } = require('../config/logger.config');

// Log all HTTP requests
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        logRequest(req);
        
        // Log slow requests (more than 1 second)
        if (duration > 1000) {
            logger.warn(`Slow request: ${req.method} ${req.url} took ${duration}ms`);
        }
    });
    
    next();
};

// Error logger middleware (to be used after error handler)
const errorLogger = (err, req, res, next) => {
    logError(err, req);
    next(err);
};

module.exports = {
    requestLogger,
    errorLogger
};