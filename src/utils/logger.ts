/**
 * Centralized logger for the Rojgari Demo application.
 * Logs are formatted with timestamps and severity levels.
 */

const isServer = typeof window === "undefined";

const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[${getTimestamp()}] [INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[${getTimestamp()}] [WARN] ${message}`, ...args);
  },
  error: (message: string, error?: any, ...args: any[]) => {
    console.error(`[${getTimestamp()}] [ERROR] ${message}`, error || "", ...args);
    
    // In production server-side, we could also write to a specific file or external service here
    if (isServer && process.env.NODE_ENV === "production") {
      // Future: integrate with Sentry or custom log file
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[${getTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  }
};

export default logger;
