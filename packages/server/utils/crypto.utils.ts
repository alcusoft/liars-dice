import { customAlphabet } from "nanoid";
import { getGameState } from "../stores/game.store";

export const createGameId = () => {
  /* Represents a Nano ID alphabet with "unsafe" and "lookalike" characters
     removed. This is inspired by
     https://github.com/CyberAP/nanoid-dictionary#nolookalikessafe but
     removes lowercase characters for easier user entry. */
  const gameIdAlphabet = customAlphabet("6789BCDFGHJKLMNPQRTW");

  let numCollisions = 0;

  /* Generate a game ID, retrying if a game already exists with that ID until
     the retry limit has been reached */
  while (numCollisions < 10) {
    try {
      const gameId = gameIdAlphabet(5);
      getGameState(gameId);
      return gameId;
    } catch (error) {
      numCollisions++;
    }
  }

  throw new Error("Failed to create a unique game ID");
};
