import pool from "../db";
import { serializeFighter } from "../serializers/fighter";
import { Fighter } from "../types/types";

export const getFighters = async (): Promise<Fighter[]> => {
  const result = await pool.query("SELECT * FROM fighter");
  return result.rows.map(serializeFighter)
}

export const getFighterById = async (id: number): Promise<Fighter | null> => {
  const result = await pool.query("SELECT * FROM fighter WHERE id = $1", [id]);
  return result.rows.length ? serializeFighter(result.rows[0]) : null
}

export const createFighter = async (data: Fighter): Promise<Fighter | null> => {
  const result = await pool.query(`INSERT INTO fighter (
    name, 
    nickname, 
    height, 
    weight, 
    reach, 
    stance, 
    dob) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *`, 
    [data.name, data.nickname, data.height, data.weight, data.reach, data.stance, data.dob])
  return result.rows.length ? serializeFighter(result.rows[0]) : null
}

export const updateFighterById = async (id: number, data: Fighter): Promise<Fighter | null> => {
  const result = await pool.query(`UPDATE fighter SET 
    name = $2, 
    nickname = $3, 
    height = $4, 
    weight = $5, 
    reach = $6, 
    stance = $7, 
    dob = $8 WHERE 
    id = $1 
    RETURNING *`, 
    [id, data.name, data.nickname, data.height, data.weight, data.reach, data.stance, data.dob]);
  return result.rows.length ? serializeFighter(result.rows[0]) : null
}

export const deleteFighterById = async (id: number): Promise<Fighter | null> => {
  const result = await pool.query("DELETE FROM fighter WHERE id = $1 RETURNING *", [id])
  return result.rows.length ? serializeFighter(result.rows[0]) : null
}