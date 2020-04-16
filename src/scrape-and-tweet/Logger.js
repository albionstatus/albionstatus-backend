const { createLogger, format, transports } = require('winston')

const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`
})

module.exports = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
})
