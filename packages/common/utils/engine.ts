import _ from "lodash";
import { getElement } from "./arrays";
import {
  type Bid,
  type Call,
  type Die,
  GameConfigPresetMap,
  type GameState,
  type LobbyState,
  type Player,
  type GameId,
} from "../types/game";

/**
 * Gets the initial lobby state for game with a specified ID and host player.
 * @param gameId The ID of the game.
 * @param hostPlayer The host player of the game.
 * @returns The initial lobby state.
 */
export const getInitialLobbyState = (
  gameId: GameId,
  hostPlayer: Player,
): LobbyState => ({
  gameId,
  hostPlayerId: hostPlayer.id,
  players: [hostPlayer],
  gameConfig: GameConfigPresetMap["classic"],
});

/**
 * Generates the initial game from the final lobby state.
 * @param lobbyState The final lobby state.
 * @returns The initial game state.
 */
export const getInitialGameState = (lobbyState: LobbyState): GameState => {
  const activePlayer = _.first(lobbyState.players);

  if (activePlayer === undefined) {
    throw new Error("Attempted to create a game with no players");
  }

  return {
    gameId: lobbyState.gameId,
    gameConfig: lobbyState.gameConfig,
    gameStatus: "AWAITING_BID",
    hostPlayerId: lobbyState.hostPlayerId,
    activePlayerId: activePlayer.id,
    previousBids: [],
    playerMap: _.keyBy(lobbyState.players, ({ id }) => id),
    biddingQueue: lobbyState.players.map(({ id }) => id),
  };
};

/**
 * Determines the active player for the next turn.
 * @param gameState The current game state.
 * @returns The active player for the next turn.
 */
export const getNextActivePlayer = (gameState: GameState) => {
  const { activePlayerId, biddingQueue, playerMap } = gameState;
  const activePlayerOrder = biddingQueue.indexOf(activePlayerId);

  if (activePlayerOrder === -1) {
    throw new Error("Active player not referenced in bidding queue");
  }

  // FIXME: Does not account for players with no dice
  const nextActivePlayerId = getElement(biddingQueue, activePlayerOrder + 1);

  if (nextActivePlayerId === undefined) {
    throw new Error("Game state contains empty bidding queue");
  }

  const nextActivePlayer = playerMap[nextActivePlayerId];
  return nextActivePlayer;
};

/**
 * Gets the number of dice between all players with a given face value.
 * @param gameState The current game state.
 * @param value The face value to compare against.
 * @returns The number of dice the given face value.
 */
const getNumDiceWithValue = (gameState: GameState, value: Die["value"]) => {
  return _.chain(gameState.playerMap)
    .values()
    .sumBy((player) => {
      const { dice } = player;
      const matchingDice = dice.filter((die) => die.value === value);
      return matchingDice.length;
    })
    .value();
};

/**
 * Determines if a specified call is correct against the active bid.
 * @param gameState The current game state.
 * @param call The call to to check for correctness.
 * @returns `true` if the call is correct, `false` otherwise.
 */
export const isCallCorrect = (gameState: GameState, call: Call) => {
  const activeBid = getActiveBid(gameState);

  // Calls can only be made after a bid was made on the first turn
  if (activeBid === undefined) {
    throw new Error("Illegal call made on the first turn");
  }

  const numDiceWithBidValue = getNumDiceWithValue(gameState, activeBid.value);

  if (call === "CHALLENGE_BID" && numDiceWithBidValue >= activeBid.value) {
    return true;
  }

  if (call === "SPOT_ON" && numDiceWithBidValue === activeBid.value) {
    return true;
  }

  return false;
};

/**
 * Determines if a next bid is valid based on the active bid.
 *  @param gameState The current game state.
 * @param nextBid The next bid to be evaluated for validity.
 * @returns `true` if the next bid is valid, `false` otherwise.
 */
export const isValidNextBid = (gameState: GameState, nextBid: Bid) => {
  // Check that the quantity of dice is at least 1
  if (nextBid.quantity <= 0) {
    return false;
  }

  // Check that the next bid is made by the active player
  if (nextBid.playerId !== gameState.activePlayerId) {
    return false;
  }

  const activeBid = getActiveBid(gameState);

  // If this is the first bid, all bids are valid
  if (activeBid === undefined) {
    return true;
  }

  // If the quantity of dice is raised from the active bid, all die values are
  // valid for the next bid
  if (nextBid.quantity > activeBid.quantity) {
    return true;
  }

  // If the quantity of dice of the next bid is the same as the quantity of dice
  // of the active bid, only higher die values are valid for the next bid
  if (
    nextBid.quantity === activeBid.quantity &&
    nextBid.value > activeBid.value
  ) {
    return true;
  }

  return false;
};

/**
 * Determines if the game is over.
 * @param gameState The current state of the game.
 * @returns `true` if the game is over, `false` otherwise.
 */
export const isGameOver = (gameState: GameState) => {
  const numPlayers = Object.keys(gameState.playerMap).length;

  const numPlayersWithNoDice = _.chain(gameState.playerMap)
    .values()
    .sumBy((player) => (player.dice.length === 0 ? 1 : 0))
    .value();

  if (numPlayersWithNoDice === numPlayers) {
    throw new Error("Invalid number of players with no dice");
  }

  return numPlayersWithNoDice === numPlayers - 1;
};
/**
 * Gets the latest bid made by a player.
 * @param gameState The current state of the game.
 * @returns The latest bid or `undefined` if no bids have been made.
 */
const getActiveBid = (gameState: GameState) => {
  return _.last(gameState.previousBids);
};

