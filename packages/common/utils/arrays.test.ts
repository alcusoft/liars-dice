import { rotateArray } from "./arrays";

describe("rotateArray", () => {
  test("Array is rotated to the left", () => {
    const array = [1, 2, 3, 4, 5];
    const actual = rotateArray(array, 3);
    const expected = [4, 5, 1, 2, 3];
    expect(actual).toEqual(expected);
  });

  test("Array is rotated to the right", () => {
    const array = [1, 2, 3, 4, 5];
    const actual = rotateArray(array, -2);
    const expected = [4, 5, 1, 2, 3];
    expect(actual).toEqual(expected);
  });

  test("Array remains the same when rotated 0 times", () => {
    const array = [1, 2, 3, 4, 5];
    const actual = rotateArray(array, 0);
    const expected = array;
    expect(actual).toEqual(expected);
  });

  test("Array remains the same when rotated completely", () => {
    const array = [1, 2, 3, 4, 5];
    const actual = rotateArray(array, 5);
    const expected = array;
    expect(actual).toEqual(expected);
  });
});
