const winston = require('winston');


const theLogger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
});

const Logger = () => theLogger;

module.exports = Logger;
