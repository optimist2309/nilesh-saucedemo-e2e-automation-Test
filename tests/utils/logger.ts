/**
 * Centralized logging utility for test automation
 * Provides structured logging with timestamps and context
 */

interface LogContext {
  testName?: string;
  stepName?: string;
  feature?: string;
  duration?: number;
  [key: string]: any;
}

/**
 * Logger provides standardized logging across the test suite
 * Usage: logger.info('Test started', { testName: 'TC-001' })
 */
export const logger = {
  /**
   * Log info level message
   * @param message - The message to log
   * @param context - Optional context object with additional information
   */
  info: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    console.log(`[ℹ️  INFO] ${timestamp}${contextStr} - ${message}`);
  },

  /**
   * Log warning level message
   * @param message - The message to log
   * @param context - Optional context object with additional information
   */
  warn: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    console.warn(`[⚠️  WARN] ${timestamp}${contextStr} - ${message}`);
  },

  /**
   * Log error level message
   * @param message - The message to log
   * @param error - Optional error object for stack trace
   * @param context - Optional context object with additional information
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    const errorMsg = error instanceof Error ? ` | Error: ${error.message}` : '';
    const errorStack = error instanceof Error ? `\n${error.stack}` : '';
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    console.error(
      `[❌ ERROR] ${timestamp}${contextStr}${errorMsg} - ${message}${errorStack}`
    );
  },

  /**
   * Log debug level message (only shown when DEBUG=true)
   * @param message - The message to log
   * @param data - Optional data to log (will be pretty-printed)
   */
  debug: (message: string, data?: any) => {
    if (process.env.DEBUG === 'true' || process.env.DEBUG === '1') {
      const timestamp = new Date().toISOString();
      console.log(`[🐛 DEBUG] ${timestamp} - ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  },

  /**
   * Log performance/timing information
   * @param label - Label for the operation
   * @param startTime - Start time in milliseconds (from performance.now())
   */
  perf: (label: string, startTime: number) => {
    const duration = performance.now() - startTime;
    const timestamp = new Date().toISOString();
    console.log(
      `[⏱️  PERF] ${timestamp} - ${label} completed in ${duration.toFixed(2)}ms`
    );
  },

  /**
   * Log test step progress
   * @param stepNumber - Step number
   * @param stepName - Name of the step
   * @param status - Status (pending, in-progress, completed, failed)
   */
  step: (stepNumber: number, stepName: string, status: 'pending' | 'in-progress' | 'completed' | 'failed') => {
    const timestamp = new Date().toISOString();
    const emoji = status === 'completed' ? '✅' : status === 'failed' ? '❌' : '⏳';
    console.log(`[${emoji} STEP] ${timestamp} - Step ${stepNumber}: ${stepName} - ${status}`);
  },
};

export default logger;
