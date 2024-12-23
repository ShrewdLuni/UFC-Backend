export class QueryBuilder {
  private table: string = "";
  private joins: string[] = [];
  private filters: string[] = [];
  private selects: string[] = [];
  private groupBy: string[] = [];
  private orderBy: string[] = [];

  constructor(table: string) {
    this.table = table;
  }

  select(fileds: string | string[]): this {
    if(Array.isArray(fileds)) {
      this.selects.push(...fileds)
    } else {
      this.selects.push(fileds)
    }
    return this;
  }

  join(joins: string): this {
    this.joins.push(joins)
    return this;
  }

  where(filter: string): this {
    this.filters.push(filter)
    return this;
  }

  group(fileds: string | string[]): this {
    if(Array.isArray(fileds)) {
      this.groupBy.push(...fileds)
    } else {
      this.groupBy.push(fileds)
    }
    return this;
  }

  order(fileds: string | string[], direction: 'ASC' | 'DESC' = "ASC"): this {
    if(Array.isArray(fileds)) {
      this.orderBy.push(...fileds.map(item => `${item} ${direction}`))
    } else {
      this.orderBy.push(`${fileds} ${direction}`)
    }
    return this;
  }

  jsonAgg(alias: string, fields: Record<string, string>): this {
    const jsonAggFields = Object.entries(fields)
      .map(([key, value]) => `'${key}', ${value}`)
      .join(', ');

    const jsonAggClause = `jsonb_agg(jsonb_build_object(${jsonAggFields})) AS ${alias}`;
    this.selects.push(jsonAggClause);
    return this;
  }

  build(): string {
    const selectClause = this.selects.length > 0 ? this.selects.join(', ') : '*';
    const fromClause = `FROM ${this.table}`;
    const joinClause = this.joins.length > 0 ? this.joins.join(' ') : '';
    const whereClause = this.filters.length > 0 ? `WHERE ${this.filters.join(' AND ')}` : '';
    const groupClause = this.groupBy.length > 0 ? `GROUP BY ${this.groupBy.join(', ')}` : '';
    const orderClause = this.orderBy.length > 0 ? `ORDER BY ${this.orderBy.join(', ')}` : '';

    return `
      SELECT ${selectClause}
      ${fromClause}
      ${joinClause}
      ${whereClause}
      ${groupClause}
      ${orderClause}
    `.trim();
  }
}