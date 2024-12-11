export const roundTo = (num: number, places: number = 2) => {
  const factor = 10 ** places;
  return Math.round(num * factor) / factor;
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = Date.parse(date);
  return !isNaN(parsedDate);
};