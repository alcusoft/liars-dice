import { RequestHandler } from "express";

const controller = {
  /** Reveals a set of the active player's dice to all other players. */
  Reveal: (req, res) => {
    throw new Error("Not implemented");
  },

  /**
   * Rerolls a set of the active player's dice.
   *
   * If one of the rerolled dice is currently visible, all other visible dice
   * must be rerolled. If one of the rerolled dice is currently hidden, all
   * other hidden dice must be rerolled. Rerolled dice can either be made
   * visible or hidden after rerolling.
   */
  Roll: (req, res) => {
    throw new Error("Not implemented");
  },
} as const satisfies Record<string, RequestHandler>;

export default controller;
