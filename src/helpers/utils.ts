export const roundTo = (num: number, places: number = 2) => {
  const factor = 10 ** places;
  return Math.round(num * factor) / factor;
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = Date.parse(date);
  return !isNaN(parsedDate);
};

export const convertFilterString = (input: string): string[] => {
  const regex = /\[([^\[\]]+)\]/g;
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

export const convertFiltersToSQL = (filters: any): string[] => {
  if (typeof filters !== "string" || !filters?.trim()) return [];

  const operatorMap = {
    eq: "=",
    ne: "!=",
    gt: ">",
    lt: "<",
    gte: ">=",
    lte: "<=",
  } as const;

  return filters.split(",").map(item => {
    const [field, rawFilter, value] = convertFilterString(item);
    const operator = operatorMap[rawFilter as keyof typeof operatorMap];
    return `${field} ${operator} ${value}`;
  });
};


export const convertOrderingToSql = (sortBy: any): { field: string; direction: "ASC" | "DESC" }[] => {
  if(typeof sortBy !== "string")
    return []
  return sortBy.split(",").map(item => {
    const [field, dir] = convertFilterString(item);
    const direction: "ASC" | "DESC" = dir?.toLowerCase() === "asc" ? "ASC" : "DESC";
    return { field, direction };
  });
};
