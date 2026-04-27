export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('./utils/logger');
    
    logger.info(`Application starting in ${process.env.NODE_ENV} mode...`);
    logger.info(`Port: ${process.env.PORT || 3000}`);
    logger.info(`Hostname: ${process.env.HOSTNAME || 'localhost'}`);

    // Log unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Log uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception thrown:', err);
      // Optional: process.exit(1) if you want it to restart immediately
    });
  }
}
