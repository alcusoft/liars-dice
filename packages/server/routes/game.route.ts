import { z } from "zod";
import { createPlayer, getInitialGameState } from "../../common/utils/engine";
import { Procedure, Router } from "../apps/trpc.app";
import { setGameState } from "../stores/game.store";
import { signAuthToken } from "../utils/auth.utils";
import { createGameId } from "../utils/crypto.utils";

const router = Router({
  /** Creates a new game. */
  create: Procedure.input(
    z.object({
      playerName: z
        .string()
        .regex(/^[a-zA-Z]*$/g)
        .min(1)
        .max(10),
    }),
  ).mutation(({ input }) => {
    const hostPlayer = createPlayer(input.playerName);
    const initialGameState = getInitialGameState(hostPlayer);
    const gameId = createGameId();
    setGameState(gameId, initialGameState);
    const token = signAuthToken(hostPlayer.id);
    return { gameId, token };
  }),

  /**
   * Joins a game with a specified ID.
   *
   * If the requester is authenticated as a player already in the game, no new
   * players will be created. If the player is unauthenticated and their is
   * room for another player, a new player is added to the game. Otherwise, the
   * requester will be made a spectator.
   */
  join: Procedure.mutation(() => {
    throw new Error("Not implemented");
  }),

  /**
   * Starts a new round.
   *
   * If the game has not started or has already ended, the new round will be
   * the first round of a new game with the same game ID.
   */
  startRound: Procedure.mutation(() => {
    throw new Error("Not implemented");
  }),

  /** Updates the order players will place bids. */
  updatePlayerOrder: Procedure.mutation(() => {
    throw new Error("Not implemented");
  }),

  /** Updates the game config by the host player. */
  updateConfig: Procedure.mutation(() => {
    throw new Error("Not implemented");
  }),
});

export default router;
