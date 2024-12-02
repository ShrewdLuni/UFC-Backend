import pool from "../db";
import { serializeFighter } from "../serializers/fighter";
import { Fighter } from "../types/types";

export const getFighters = async (): Promise<Fighter[]> => {
  const result = await pool.query("SELECT * FROM fighter");
  return result.rows.map(serializeFighter)
}