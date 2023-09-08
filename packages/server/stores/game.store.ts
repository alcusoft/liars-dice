import _ from "lodash";
import { type GameId, type GameState } from "../../common/types/game";
import { createEnhancedStore } from "../utils/store.utils";

type GameStateStoreState = {
  gameStateMap: Record<GameId, GameState>;
  getGameState: (gameId: GameId) => GameState;
  setGameState: (
    gameId: GameId,
    newGameState: GameState | ((prevGameState: GameState) => void),
  ) => void;
  onGameStateChange: (
    gameId: GameId,
    callback: (gameState: GameState) => void,
  ) => void;
};

const GameStateStore = createEnhancedStore<GameStateStoreState>(
  (set, get, store) => ({
    /** A map of game IDs to game states. */
    gameStateMap: {},

    /**
     * Gets the current state of a game.
     * @param gameId The ID of the game.
     * @returns The current game state.
     * @throws An error if no game exists with the specified ID.
     */
    getGameState: (gameId) => {
      const gameState = get().gameStateMap[gameId];
      if (gameState === undefined) {
        throw new Error(`Game not found: "${gameId}"`);
      }
      return gameState;
    },

    /**
     * Sets the state of a game.
     * @param gameId The ID of the game.
     * @param newGameState When given a function, the state will be updated
     * based on the mutations made to the previous game state. When given a
     * game state object, the game state will be overwritten entirely.
     */
    setGameState: (gameId, newGameState) => {
      set((state) => {
        if (typeof newGameState === "function") {
          const prevGameState = state.getGameState(gameId);
          const prevGameStateClone = _.cloneDeep(prevGameState);
          newGameState(prevGameStateClone);
          state.gameStateMap[gameId] = prevGameStateClone;
        } else {
          state.gameStateMap[gameId] = newGameState;
        }
      });
    },

    /**
     * Adds a listener to trigger when the state of a game changes.
     * @param gameId The ID of the game.
     * @param callback A callback to call when the game state changes.
     */
    onGameStateChange: (gameId, callback) => {
      const { getGameState } = get();

      // Trigger the callback with the current game state
      callback(getGameState(gameId));

      // Trigger the callback anytime the game state changes in the future
      store.subscribe(
        () => getGameState(gameId),
        (gameState) => callback(gameState),
      );
    },
  }),
);

export const { getGameState, setGameState, onGameStateChange } =
  GameStateStore.getState();
