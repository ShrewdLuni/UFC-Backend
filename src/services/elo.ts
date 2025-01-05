import pool from "../db";
import { QueryBuilder } from "../queryBuilder";
import { EloSerializer } from "../serializers/elo";
import { ExtendedElo } from "../types/extendedTypes";

export const getElo = async (filters: string | string[], sort_by : { field: string; direction: "ASC" | "DESC"; }[], options: { includeFighterInfo: boolean }): Promise<ExtendedElo[] | null> => {
  
  const queryBuilder = new QueryBuilder('elo');

  queryBuilder.select("elo.*").where(filters)
  for(let item of sort_by)
    queryBuilder.order(item.field, item.direction)
  
  if(options.includeFighterInfo){
    queryBuilder.select("fighter.name").join("JOIN fighter ON fighter.id = elo.fighter_id")
  }

  const result = await pool.query(queryBuilder.build())
  return result.rows || null
} 

export const getEloById = async (id: number): Promise<ExtendedElo | null> => {
  const result = await pool.query("SELECT * FROM elo WHERE id = $1", [id]);
  return result.rows.length ? result.rows[0] : null
}

export const getLatestEloByFighterId = async (fighterId: number): Promise<ExtendedElo | null> => {
  const result = await pool.query(`
    SELECT *
    FROM elo
    WHERE fighter_id = $1
    ORDER BY date DESC
    LIMIT 1;
  `, [fighterId]);
  return result.rows[0] || null;
};

export const createElo = async (data: any): Promise<ExtendedElo | null> => {
  const currentElo = new EloSerializer(data)
  currentElo.validate()
  const values = currentElo.toDatabaseObject()

  const result = await pool.query(`INSERT INTO elo (
    fighter_id,
    type,
    weight_class,
    date,
    value)
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`, 
    [values.fighterId, values.type, values.weightClass, values.date, values.value])
  return result.rows.length ? result.rows[0] : null
}

export const updateEloById = async (id: number, data: any): Promise<ExtendedElo | null> => {
  const currentElo = new EloSerializer(data)
  currentElo.validate()
  const values = currentElo.toDatabaseObject()

  const result = await pool.query(`UPDATE elo SET 
    fighter_id = $2,
    type = $3,
    weight_class = $4,
    date = $5,
    value = $6,
    WHERE 
    id = $1 
    RETURNING *`, 
    [id, values.fighterId, values.type, values.weightClass, values.date, values.date]);
  return result.rows.length ? result.rows[0] : null
}

export const deleteEloById = async (id: number): Promise<ExtendedElo | null> => {
  const result = await pool.query("DELETE FROM elo WHERE id = $1 RETURNING *", [id])
  return result.rows.length ? result.rows[0] : null
}