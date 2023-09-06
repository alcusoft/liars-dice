import { RequestHandler } from "express";

const controller = {
  /** Updates the requester's player information. */
  Update: (req, res) => {
    throw new Error("Not implemented");
  },
} as const satisfies Record<string, RequestHandler>;

export default controller;
