import pool from "../db";
import logger from "../logger";
import { FighterSerializer } from "../serializers/fighter";
import { Fighter } from "../types/types";

export const getFighters = async (): Promise<Fighter[]> => {
  const result = await pool.query("SELECT * FROM fighter");
  return result.rows
}

export const getFighterById = async (id: number): Promise<Fighter | null> => {
  const result = await pool.query("SELECT * FROM fighter WHERE id = $1", [id]);
  return result.rows.length ? result.rows[0] : null
}

export const getFighterByUniqueFields = async (name: string, dob: string) => {
  // console.log(name, dob)
  let validDob: string | null = dob
  if (dob === '--' || isNaN(Date.parse(dob))) {
    validDob = null; // Set to null if invalid
  }

  // logger.warn(`Main INFO:Trying to get fighter by ${name}, ${dob}, ${validDob}\n`)
  const result = await pool.query(`
    SELECT * FROM fighter
    WHERE name = $1 AND dob = $2;`,
    [name, validDob]);
  return result.rows.length ? result.rows[0] : null;
};

export const createFighter = async (data: Fighter): Promise<Fighter | null> => {
  const currentFighter = new FighterSerializer(data);
  currentFighter.validate();
  const values = currentFighter.toDatabaseObject();

  const result = await pool.query(
    `INSERT INTO fighter (
      name, 
      nickname, 
      height, 
      weight, 
      reach, 
      stance, 
      dob
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`,
    [values.name, values.nickname, values.height, values.weight, values.reach, values.stance, values.dob]
  );

  return result.rows[0];
};

export const updateFighterById = async (id: number, data: Fighter): Promise<Fighter | null> => {
  const currentFighter = new FighterSerializer(data)
  currentFighter.validate()
  const values = currentFighter.toDatabaseObject()

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
    [id, values.name, values.nickname, values.height, values.weight, values.reach, values.stance, values.dob]);
  return result.rows.length ? result.rows[0] : null
}

export const deleteFighterById = async (id: number): Promise<Fighter | null> => {
  const result = await pool.query("DELETE FROM fighter WHERE id = $1 RETURNING *", [id])
  return result.rows.length ? result.rows[0] : null
}