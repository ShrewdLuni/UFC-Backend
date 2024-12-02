import pool from "../db";
import { serializeFighter } from "../serializers/fighter";
import { Fighter } from "../types/types";

export const getFighters = async (): Promise<Fighter[]> => {
  const result = await pool.query("SELECT * FROM fighter");
  return result.rows.map(serializeFighter)
}

export const getFighterById = async (): Promise<Fighter | null> => {
  return null
}

export const createFighterById = async (): Promise<Fighter | null> => {
  return null
}

export const updateFighterById = async (): Promise<Fighter | null> => {
  return null
}

export const deleteFighterById = async (): Promise<Fighter | null> => {
  return null
}