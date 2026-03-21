// ============================================================
// Error Handling Middleware
// ============================================================

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
  // Silently handle favicon requests (browser default)
  if (req.originalUrl === '/favicon.ico') {
    return res.status(204).end();
  }

  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`❌ [${req.method}] ${req.originalUrl} — ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
