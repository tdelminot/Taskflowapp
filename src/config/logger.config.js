const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Custom format for readable logs
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        if (Object.keys(meta).length > 0 && meta.stack !== undefined) {
            log += `\n${stack}`;
        } else if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return log;
    })
);

// Daily rotate file transport for all logs
const dailyRotateTransport = new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'taskflow-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: customFormat
});

// Separate error log file
const errorTransport = new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d',
    format: customFormat
});

// Console transport for development
const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
});

// Create logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [
        dailyRotateTransport,
        errorTransport
    ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(consoleTransport);
}

// Helper functions for different contexts
const logRequest = (req, userId = null) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userId: userId || req.userId || 'anonymous',
        userAgent: req.get('user-agent')
    });
};

const logError = (error, req = null, context = '') => {
    const logData = {
        message: error.message,
        stack: error.stack,
        context
    };
    
    if (req) {
        logData.url = req.url;
        logData.method = req.method;
        logData.ip = req.ip;
        logData.userId = req.userId || 'anonymous';
        logData.body = req.body;
        logData.query = req.query;
        logData.params = req.params;
    }
    
    logger.error(error.message, logData);
};

const logDatabaseQuery = (query, duration) => {
    logger.debug(`Database query: ${query}`, { duration: `${duration}ms` });
};

const logCacheHit = (key, source) => {
    logger.debug(`Cache ${source}: ${key}`);
};

module.exports = {
    logger,
    logRequest,
    logError,
    logDatabaseQuery,
    logCacheHit
};