import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => {
            const { timestamp, level, message } = info;
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console({
            silent: process.env.NODE_ENV === 'production'
        })
    ],
});

export default logger;