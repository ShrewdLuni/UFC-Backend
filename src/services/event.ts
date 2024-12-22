import pool from "../db";
import { EventSerializer } from "../serializers/event";
import { Event } from "../types/types";

export const getEvents = async (filters: string = ""): Promise<Event[]> => {
  // const queryOne = "SELECT * FROM event" + filters//base info
  // const queryTwo = `SELECT 
  //   event.*, 
  //   jsonb_agg(
  //     jsonb_build_object(
  //       'id', fight.id,
  //       'fighter_one_id', fight.fighter_one_id,
  //       'fighter_two_id', fight.fighter_two_id,
  //       'result', fight.result,
  //       'method', fight.method,
  //       'method_details', fight.method_details,
  //       'weight_class', fight.weight_class,
  //       'round', fight.round,
  //       'time', fight.time
  //     )
  //   ) AS fights
  //   FROM event
  //   JOIN fight ON fight.event_id = event.id
  //   GROUP BY event.id
  //   ORDER BY event.date DESC;`
  const query = `SELECT 
    event.*, 
    jsonb_agg(
      jsonb_build_object(
        'id', fight.id,
        'fighter_one_id', fight.fighter_one_id,
        'fighter_one_name', fighter_one.name,
        'fighter_two_id', fight.fighter_two_id,
        'fighter_two_name', fighter_two.name,
        'result', fight.result,
        'method', fight.method,
        'method_details', fight.method_details,
        'weight_class', fight.weight_class,
        'round', fight.round,
        'time', fight.time
      )
    ) AS fights
    FROM event
    JOIN fight ON fight.event_id = event.id
    JOIN fighter AS fighter_one ON fighter_one.id = fight.fighter_one_id
    JOIN fighter AS fighter_two ON fighter_two.id = fight.fighter_two_id
    GROUP BY event.id
    ORDER BY event.date DESC;`
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