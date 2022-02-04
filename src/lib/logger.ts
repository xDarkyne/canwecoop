import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;

const defaultFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: 'log' }),
    timestamp(),
    defaultFormat
  ),
  transports: [
    new DailyRotateFile({
      dirname: './logs',
      filename: 'cwc-%DATE%.log',
      datePattern: 'YYYY-DD-MM-HH',
      maxSize: '20M',
      maxFiles: '14d'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

export default logger;
