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

export const convertFiltersToSQL = (filters: any) : string[] => {
  if(!filters){
    return []
  }

  let sqlFilters = []

  for(const item of filters.split(",")){
    const data = convertFilterString(item);
    const field =  data[0]
    const value = data[2]
    const rawFilter = data[1]
    let filter = "="
    if(rawFilter == "eq")
      filter = "="
    else if(rawFilter == "ne")
      filter = "!="
    else if(rawFilter == "gt")
      filter = ">"
    else if(rawFilter == "lt")
      filter = "<"
    else if(rawFilter == "gte")
      filter = ">="
    else if(rawFilter == "lte")
      filter = "<="
    sqlFilters.push(`${field} ${filter} ${value}`)
  }
  return sqlFilters;
}

export const convertOrderingToSql = (sortBy: any): { field: string; direction: "ASC" | "DESC" }[] => {
  if(typeof sortBy !== "string")
    return []
  return sortBy.split(",").map(item => {
    const [field, dir] = convertFilterString(item);
    const direction: "ASC" | "DESC" = dir?.toLowerCase() === "asc" ? "ASC" : "DESC";
    return { field, direction };
  });
};
