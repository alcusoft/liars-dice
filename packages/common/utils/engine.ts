import _ from "lodash";
import { getElement } from "./arrays";
import {
  GameConfigPresetMap,
  type Bid,
  type Call,
  type Die,
  type GameState,
  type Player,
} from "../types/game";

/**
 * Generates the initial state for a game with a specified host player.
 * @param hostPlayer The host player.
 * @returns The initial game state.
 */
export const getInitialGameState = (hostPlayer: Player): GameState => {
  return {
    gameConfig: GameConfigPresetMap.classic,
    gameStatus: "IN_LOBBY",
    hostPlayerId: hostPlayer.id,
    activePlayerId: hostPlayer.id,
    previousBids: [],
    playerMap: { [hostPlayer.id]: hostPlayer },
    biddingQueue: [hostPlayer.id],
    activeCall: undefined,
    timerStartTime: undefined,
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

  if (call.type === "CHALLENGE_BID" && numDiceWithBidValue >= activeBid.value) {
    return true;
  }

  if (call.type === "SPOT_ON" && numDiceWithBidValue === activeBid.value) {
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
  return gameState.biddingQueue.length === 1;
};

/**
 * Rolls a specified die
 * @param die The die to roll
 */
export const rollDie = (die: Die) => {
  const newValue = _.random(1, 6) as Die["value"];
  die.value = newValue;
};

/**
 * Gets the latest bid made by a player.
 * @param gameState The current state of the game.
 * @returns The latest bid or `undefined` if no bids have been made.
 */
const getActiveBid = (gameState: GameState) => {
  return _.last(gameState.previousBids);
};

