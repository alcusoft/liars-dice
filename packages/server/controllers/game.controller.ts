import { RequestHandler } from "express";

const controller = {
  /** Creates a new game. */
  Create: (req, res) => {
    throw new Error("Not implemented");
  },

  /**
   * Joins a game with a specified ID.
   *
   * If the requester is authenticated as a player already in the game, no new
   * players will be created. If the player is unauthenticated and their is
   * room for another player, a new player is added to the game. Otherwise, the
   * requester will be made a spectator.
   */
  Join: (req, res) => {
    throw new Error("Not implemented");
  },

  /**
   * Starts a new round.
   *
   * If the game has not started or has already ended, the new round will be
   * the first round of a new game with the same game ID.
   */
  StartRound: (req, res) => {
    throw new Error("Not implemented");
  },

  /** Updates the game config by the host player. */
  UpdateConfig: (req, res) => {
    throw new Error("Not implemented");
  },
} as const satisfies Record<string, RequestHandler>;

export default controller;
