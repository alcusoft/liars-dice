export const getElement = <T>(array: T[], index: number) => {
  if (index < 0) {
    throw new Error("Illegal array index provided");
  }

  if (array.length === 0) {
    return undefined;
  }

  return array[index % array.length];
};
