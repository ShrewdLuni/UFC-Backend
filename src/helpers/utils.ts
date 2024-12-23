export const roundTo = (num: number, places: number = 2) => {
  const factor = 10 ** places;
  return Math.round(num * factor) / factor;
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = Date.parse(date);
  return !isNaN(parsedDate);
};

export const getFiltersFromQuery = (query: any) => {
  const filters: Record<string, any> = Object.entries(query)
  .filter(([key]) => key.startsWith("filter_"))
  .reduce((acc: Record<string, any>, [key, value]) => {
    const [, part1, part2] = key.split("_");
    acc[`${part1}_${part2}`] = value;
    return acc;
  }, {});
  return filters;
}

export const convertFiltersToSQL = (filters: any) : string => {
  let sqlFilters = []
  for(const item in filters){
    const data = item.split("_");
    const filed =  data[0]
    const value = filters[item]
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
    sqlFilters.push(`${filed} ${filter} ${value}`)
  }
  const result = sqlFilters.length > 1 ? ` WHERE ${sqlFilters.join(" AND ")};` : ""
  return result;
}