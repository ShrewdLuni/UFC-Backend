import pool from "../db";
import { QueryBuilder } from "../queryBuilder";
import { EventSerializer } from "../serializers/event";
import { Event } from "../types/types";

export const getEvents = async (filters: string | string[]): Promise<Event[]> => {
  const includeFightsInfo = false;
  const includeFightersNames = false; 

  const queryBuilder = new QueryBuilder('event');

  queryBuilder.select('event.*').where(filters).group('event.id').order('event.date', 'DESC');
  
  if (includeFightsInfo || includeFightersNames) {
    queryBuilder.join('JOIN fight ON fight.event_id = event.id');

    const jsonFields: Record<string, string> = {
      id: 'fight.id',
      fighter_one_id: 'fight.fighter_one_id',
      fighter_two_id: 'fight.fighter_two_id',
      result: 'fight.result',
      method: 'fight.method',
      method_details: 'fight.method_details',
      weight_class: 'fight.weight_class',
      round: 'fight.round',
      time: 'fight.time',
    }
    if(includeFightersNames){
      jsonFields['fighter_one_name'] = 'fighter_one.name'
      jsonFields['fighter_two_name'] = 'fighter_two.name'
      queryBuilder.join('JOIN fighter AS fighter_one ON fighter_one.id = fight.fighter_one_id').join('JOIN fighter AS fighter_two ON fighter_two.id = fight.fighter_two_id')
    }
    queryBuilder.jsonAgg('fights', jsonFields)
  }

  const result = await pool.query(queryBuilder.build());
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