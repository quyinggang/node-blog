import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'node:path';

const options = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
};

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} - ${level}: ${message}`;
});

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: () => new Date().toLocaleString() }),
    customFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), customFormat),
    }),
    new DailyRotateFile({
      filename: path.resolve('src/logs/%DATE%.log'),
      ...options,
    }),
  ],
});

export default logger;
