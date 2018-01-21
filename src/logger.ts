const winston = require('winston')
const { combine, timestamp, splat, printf } = winston.format

const errorsFile = new winston.transports.File({
    filename: 'logs/errors.log',
    level: 'error',
})

const exceptionsFile = new winston.transports.File({
    filename: 'logs/exceptions.log',
})

const combinedFile = new winston.transports.File({
    filename: 'logs/combined.log',
    level: 'info',
})

const testFile = new winston.transports.File({
    filename: 'logs/test.log',
    level: 'info',
})

const consoleLog = new winston.transports.Console({
    level: 'debug',
})

interface Info {
    timestamp: string
    level: string
    message: string
}

const logFormat = combine(
    timestamp(),
    splat(),
    printf((info: Info) => `${info.timestamp} [${info.level}] ${info.message}`)
)

let logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [errorsFile, combinedFile],
    exceptionHandlers: [exceptionsFile],
})

const testLogger = winston.createLogger({
    format: combine(splat(), printf((info: Info) => `[${info.level}] ${info.message}`)),
    transports: [testFile],
    exceptionHandlers: [testFile],
    exitOnError: false,
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(consoleLog)
}

if (process.env.NODE_ENV === 'test') {
    logger = testLogger
}

export default logger
