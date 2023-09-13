import _ from "lodash";
import { Die, GameConfigPresetMap, GameState } from "../types/game";
import { isGameOver, rollDie } from "./engine";

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
      timerStartTime: undefined
    };

    expect(isGameOver(state)).toEqual(true);
  });
});
