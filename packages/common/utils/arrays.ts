/**
 * Rotates the elements of an array by a specified number of positions, adding
 * overflowing elements to the other end of the array.
 * @param array The array to rotate.
 * @param n The number of positions to rotate the array elements. A positive
 * number will move elements toward the start of the array. A negative number
 * will move elements toward the end of the array.
 * @returns The rotated array.
 */
export const rotateArray = <T>(array: T[], n: number) => {
  const head = array.slice(n);
  const tail = array.slice(0, n);
  return [...head, ...tail];
};
