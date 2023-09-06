import { ErrorRequestHandler } from "express";

/**
 * Intercepts all errors thrown by other request handlers and formats them as
 * responses
 */
const middleware: ErrorRequestHandler = (err: Error, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
};

export default middleware;
