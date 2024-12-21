import pool from "../db";
import { EventSerializer } from "../serializers/event";
import { Event } from "../types/types";

export const getEvents = async (filters: string = ""): Promise<Event[]> => {
  const query = "SELECT * FROM event" + filters
  const result = await pool.query(query);
  return result.rows
}

export const getEventById = async (id: number): Promise<Event | null> => {
  const result = await pool.query("SELECT * FROM event WHERE id = $1", [id]);
  return result.rows.length ? result.rows[0] : null
}

export const createEvent = async (data: any): Promise<Event | null> => {
  const currentEvent = new EventSerializer(data)
  currentEvent.validate()
  const values = currentEvent.toDatabaseObject()

  const result = await pool.query(`INSERT INTO event (
    name,
    location,
    date)
    VALUES ($1, $2, $3) 
    RETURNING *`, 
    [values.name, values.location, values.date])
  return result.rows.length ? result.rows[0] : null
}

export const updateEventById = async (id: number, data: any): Promise<Event | null> => {
  const currentEvent = new EventSerializer(data)
  currentEvent.validate()
  const values = currentEvent.toDatabaseObject()

  const result = await pool.query(`UPDATE event SET 
    name = $2, 
    location = $3, 
    date = $4, 
    WHERE 
    id = $1 
    RETURNING *`, 
    [id, values.name, values.location, values.date]);
  return result.rows.length ? result.rows[0] : null
}

export const deleteEventById = async (id: number): Promise<Event | null> => {
  const result = await pool.query("DELETE FROM event WHERE id = $1 RETURNING *", [id])
  return result.rows.length ? result.rows[0] : null
}