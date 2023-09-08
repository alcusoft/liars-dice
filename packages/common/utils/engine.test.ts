import _ from "lodash";
import { Die } from "../types/game";
import { rollDie } from "./engine";

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
