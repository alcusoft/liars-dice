import { RequestHandler } from "express";

const controller = {
  /** Creates a new bid by the active player. */
  Create: (req, res) => {
    throw new Error("Not implemented");
  },
} as const satisfies Record<string, RequestHandler>;

export default controller;
