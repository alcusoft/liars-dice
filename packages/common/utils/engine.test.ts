import _ from "lodash";
import { Die, GameConfigPresetMap, GameState } from "../types/game";
import { applyCallToGameState, isGameOver, rollDie } from "./engine";

describe("rollDie", () => {
  test("All face values can be rolled", () => {
    const die: Die = {
      id: "123",
      value: 1,
      isVisible: false,
    };

    // Accumulator of unique face values rolled
    const uniqueRolledValues = new Set<Die["value"]>();

    // Roll the die a sufficient number of times to negate randomness
    _.times(1000, () => {
      rollDie(die);
      uniqueRolledValues.add(die.value);
    });

    const actual = Array.from(uniqueRolledValues).sort();
    const expected = [1, 2, 3, 4, 5, 6];
    expect(actual).toEqual(expected);
  });
});

describe("Basic GameState update operations", () => {
  test("isGameOver check", () => {
    const state: GameState = {
      gameConfig: GameConfigPresetMap.classic,
      activePlayerId: "a",
      biddingQueue: ["a"],
      gameStatus: "ROUND_OVER",
      hostPlayerId: "b",
      playerMap: {},
      previousBids: [],
      activeCall: undefined,
      timerStartTime: undefined,
    };

    expect(isGameOver(state)).toEqual(true);
  });

  test("applyCallToGameState: check correct challenge call", () => {
    const currentState: GameState = {
      gameConfig: GameConfigPresetMap.classic,
      hostPlayerId: "a",
      activePlayerId: "b",
      biddingQueue: ["b", "a"],
      gameStatus: "AWAITING_BID",
      playerMap: {
        a: {
          id: "a",
          emoji: "emoji",
          name: "a",
          dice: [
            { id: "a1", isVisible: false, value: 1 },
            { id: "a2", isVisible: false, value: 6 },
            { id: "a3", isVisible: false, value: 1 },
          ],
        },
        b: {
          id: "b",
          emoji: "emoji",
          name: "b",
          dice: [
            { id: "b1", isVisible: false, value: 1 },
            { id: "b2", isVisible: false, value: 2 },
            { id: "b3", isVisible: false, value: 1 },
          ],
        },
      },
      previousBids: [{ playerId: "a", value: 2, quantity: 6 }],
      activeCall: undefined,
      timerStartTime: undefined,
    };

    const newGameState: GameState = applyCallToGameState(
      currentState,
      "CHALLENGE_BID",
    );
    expect(newGameState.gameStatus).toBe("ROUND_OVER");
    expect(newGameState.activeCall?.isCorrect).toBe(true);
    expect(newGameState.activeCall?.effect?.playerId).toBe("a");
    expect(newGameState.activeCall?.effect?.numDiceDelta).toBe(-1);
  });

  test("applyCallToGameState: check incorrect challenge call", () => {
    const currentState: GameState = {
      gameConfig: GameConfigPresetMap.classic,
      hostPlayerId: "a",
      activePlayerId: "b",
      biddingQueue: ["b", "a"],
      gameStatus: "AWAITING_BID",
      playerMap: {
        a: {
          id: "a",
          emoji: "emoji",
          name: "a",
          dice: [
            { id: "a1", isVisible: false, value: 1 },
            { id: "a2", isVisible: false, value: 6 },
            { id: "a3", isVisible: false, value: 1 },
          ],
        },
        b: {
          id: "b",
          emoji: "emoji",
          name: "b",
          dice: [
            { id: "b1", isVisible: false, value: 1 },
            { id: "b2", isVisible: false, value: 2 },
            { id: "b3", isVisible: false, value: 1 },
          ],
        },
      },
      previousBids: [{ playerId: "a", value: 1, quantity: 3 }],
      activeCall: undefined,
      timerStartTime: undefined,
    };

    const newGameState: GameState = applyCallToGameState(
      currentState,
      "CHALLENGE_BID",
    );
    expect(newGameState.gameStatus).toBe("ROUND_OVER");
    expect(newGameState.activeCall?.isCorrect).toBe(false);
    expect(newGameState.activeCall?.effect?.playerId).toBe("b");
    expect(newGameState.activeCall?.effect?.numDiceDelta).toBe(-1);
  });

  test("applyCallToGameState: check correct spot-on call", () => {
    const currentState: GameState = {
      gameConfig: GameConfigPresetMap.classic,
      hostPlayerId: "a",
      activePlayerId: "b",
      biddingQueue: ["b", "a"],
      gameStatus: "AWAITING_BID",
      playerMap: {
        a: {
          id: "a",
          emoji: "emoji",
          name: "a",
          dice: [
            { id: "a1", isVisible: false, value: 1 },
            { id: "a2", isVisible: false, value: 6 },
            { id: "a3", isVisible: false, value: 1 },
          ],
        },
        b: {
          id: "b",
          emoji: "emoji",
          name: "b",
          dice: [
            { id: "b1", isVisible: false, value: 1 },
            { id: "b3", isVisible: false, value: 1 },
          ],
        },
      },
      previousBids: [{ playerId: "a", value: 1, quantity: 4 }],
      activeCall: undefined,
      timerStartTime: undefined,
    };

    const newGameState: GameState = applyCallToGameState(
      currentState,
      "SPOT_ON",
    );
    expect(newGameState.gameStatus).toBe("ROUND_OVER");
    expect(newGameState.activeCall?.isCorrect).toBe(true);
    expect(newGameState.activeCall?.effect?.playerId).toBe("b");
    expect(newGameState.activeCall?.effect?.numDiceDelta).toBe(1);
  });

  test("applyCallToGameState: check incorrect spot-on call", () => {
    const currentState: GameState = {
      gameConfig: GameConfigPresetMap.classic,
      hostPlayerId: "a",
      activePlayerId: "b",
      biddingQueue: ["b", "a"],
      gameStatus: "AWAITING_BID",
      playerMap: {
        a: {
          id: "a",
          emoji: "emoji",
          name: "a",
          dice: [
            { id: "a1", isVisible: false, value: 1 },
            { id: "a2", isVisible: false, value: 6 },
            { id: "a3", isVisible: false, value: 1 },
          ],
        },
        b: {
          id: "b",
          emoji: "emoji",
          name: "b",
          dice: [
            { id: "b1", isVisible: false, value: 1 },
            { id: "b2", isVisible: false, value: 2 },
            { id: "b3", isVisible: false, value: 1 },
          ],
        },
      },
      previousBids: [{ playerId: "a", value: 2, quantity: 6 }],
      activeCall: undefined,
      timerStartTime: undefined,
    };

    const newGameState: GameState = applyCallToGameState(
      currentState,
      "SPOT_ON",
    );
    expect(newGameState.gameStatus).toBe("ROUND_OVER");
    expect(newGameState.activeCall?.isCorrect).toBe(false);
    expect(newGameState.activeCall?.effect?.playerId).toBe("b");
    expect(newGameState.activeCall?.effect?.numDiceDelta).toBe(-1);
  });
});
