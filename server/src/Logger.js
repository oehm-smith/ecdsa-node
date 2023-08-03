const winston = require('winston');


const theLogger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
});

const Logger = () => theLogger;

//             transports: [
//                 //
//                 // - Write all logs with importance level of `error` or less to `error.log`
//                 // - Write all logs with importance level of `info` or less to `combined.log`
//                 //
//                 new winston.transports.File({ filename: 'error.log', level: 'error' }),
//                 new winston.transports.File({ filename: 'combined.log' }),
//             ],
//         });
//
// //
// // If we're not in production then log to the `console` with the format:
// // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// //
//         if (process.env.NODE_ENV !== 'production') {
//             logger.add(new winston.transports.Console({
//                 format: winston.format.simple(),
//             }));
//         }
//     }
// }

module.exports = Logger;
