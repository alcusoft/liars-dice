import { RequestHandler } from "express";

const controller = {
  /** Creates a new call by the active player against the latest bid. */
  Create: (req, res) => {
    throw new Error("Not implemented");
  },
} as const satisfies Record<string, RequestHandler>;

export default controller;
