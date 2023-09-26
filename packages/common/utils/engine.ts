import _, { last } from "lodash";
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
 * Creates a player.
 * @param name The name of the player.
 * @returns The new player.
 */
export const createPlayer = (name: Player["name"]): Player => {
  return {
    id: "123",
    name,
    emoji: "", // TODO: Set a random emoji
    dice: [],
  };
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
 * @param callType The type of call to check for correctness.
 * @returns `true` if the call is correct, `false` otherwise.
 */
export const isCallCorrect = (gameState: GameState, callType: Call["type"]) => {
  const activeBid = getActiveBid(gameState);

  // Calls can only be made after a bid was made on the first turn
  if (activeBid === undefined) {
    throw new Error("Illegal call made on the first turn");
  }

  const numDiceWithBidValue = getNumDiceWithValue(gameState, activeBid.value);

  // If the actual number of dice with the bid value is greater than or equal to the
  // bid quantity, then the bidder wins and the call is incorrect.
  if (callType === "CHALLENGE_BID" && numDiceWithBidValue < activeBid.quantity) {
    return true;
  }

  if (callType === "SPOT_ON" && numDiceWithBidValue === activeBid.quantity) {

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
  if (gameState.biddingQueue.length === 0) {
    throw new Error("No players are in the bidding queue.");
  }

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

/**
 * Computes the effect of a call, and updates it within the GameState.
 * Doesn't kick out losers or adjust the number of dice. 
 * @param gameState 
 * @param callType 
 * @returns modified gameState
 */
export const applyCallToGameState = (gameState: GameState, callType: Call["type"]) => {
  const currentPlayer = gameState.activePlayerId;
  const lastPlayer = _.last(gameState.biddingQueue)

  //TODO: Remove unnecessary error checks after server code is fleshed out.
  if (gameState.activeCall !== undefined) {
    throw new Error("A call is already in action.")
  }

  if (gameState.gameStatus !== "AWAITING_BID" || gameState.biddingQueue.length < 2) {
    throw new Error("No round is in play.  A call cannot be made until the round starts.")
  }

  if (lastPlayer === undefined) {
    throw new Error("lastPlayer is undefined.  Bidding queue is empty.")
  }

  const callIsCorrect = isCallCorrect(gameState, callType);

  let effect: Call["effect"];
  if (callType === "CHALLENGE_BID") {
    effect = {
      playerId: callIsCorrect ? String(lastPlayer) : currentPlayer,
      numDiceDelta: -1,
    }
  } else {
    effect = {
      playerId: currentPlayer,
      numDiceDelta: callIsCorrect ? 1 : -1,
    }
  }

  gameState.gameStatus = "ROUND_OVER";
  gameState.activeCall = {
    type: callType,
    isCorrect: callIsCorrect,
    playerId: currentPlayer,
    effect: effect,
  }
  return gameState;
}
