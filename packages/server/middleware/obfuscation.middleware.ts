import { RequestHandler } from "express";

const middleware: RequestHandler = (req, res, next) => {
  console.error("Not implemented");
  next();
};

export default middleware;
