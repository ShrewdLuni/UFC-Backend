import pool from "../db"
import { QueryBuilder } from "../queryBuilder"
import { FightSerializer } from "../serializers/fight"
import { Fight } from "../types/types"

export const getFights = async (filters : string = "") => {
  const includeFighterNames = false;
  const includeEvnentInfo = false; 

  const queryBuilder = new QueryBuilder('fight');

  queryBuilder.select('fight.*');

  if (includeFighterNames) {
    queryBuilder
      .select('fighter_one.name AS fighter_one_name')
      .select('fighter_two.name AS fighter_two_name')
      .join('JOIN fighter AS fighter_one ON fighter_one.id = fight.fighter_one_id')
      .join('JOIN fighter AS fighter_two ON fighter_two.id = fight.fighter_two_id');
  }

  if (includeEvnentInfo) {
    queryBuilder
      .select('event.name')
      .select('event.location')
      .select('event.date')
      .join('JOIN event ON event.id = fight.event_id');
  }

  const result = await pool.query(queryBuilder.build())
  return result.rows
}

export const getAllFightsWithEventDates = async () => {
  const result = await pool.query(`
    SELECT fight.*, event.date AS event_date
    FROM fight
    JOIN event ON fight.event_id = event.id
    ORDER BY event.date ASC;
  `);
  return result.rows;
};

export const getFightById = async (id: number): Promise<Fight | null> => {
  const result = await pool.query("SELECT * FROM fight WHERE id = $1", [id]);
  return result.rows.length ? result.rows[0] : null
}

export const createFight = async (data: Fight, event_id: number): Promise<number> => {
  const currentFight = new FightSerializer(data)
  currentFight.validate()
  const values = currentFight.toDatabaseObject()

  const result = await pool.query(`INSERT INTO fight (
    event_id,
    fighter_one_id,
    fighter_two_id,
    result,
    winner_id,
    method,
    method_details,
    weight_class,
    round,
    time
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
    `,
    [
      event_id,
      values.fighterOneId,
      values.fighterTwoId,
      values.winner,
      values.winnerId,
      values.methodName,
      values.methodDetails,
      values.weightClass,
      values.round,
      values.time,
    ]
  );
  return result.rows[0]
}

export const updateFightById = async (id: number, data: Fight): Promise<Fight | null> => {
  const currentFight = new FightSerializer(data)
  currentFight.validate()
  const values = currentFight.toDatabaseObject()

  const result = await pool.query(`UPDATE fighter SET 
    event_id = $2, 
    fighter_one_id = $3, 
    fighter_two_id = $4, 
    result = $5, 
    winner_id = $6, 
    method = $7, 
    method_details = $8,
    weight_class = $9,
    round = $10,
    time = $11
    WHERE id = $1 
    RETURNING *`,
    [
      id,     
      values.eventId,
      values.fighterOneId,
      values.fighterTwoId,
      values.winner,
      values.winnerId,
      values.methodName,
      values.methodDetails,
      values.weightClass,
      values.round,
      values.time,
    ]);
  return result.rows.length ? result.rows[0] : null
}

export const deleteFightById = async (id: number): Promise<Fight | null> => {
  const result = await pool.query("DELETE FROM fight WHERE id = $1 RETURNING *", [id])
  return result.rows.length ? result.rows[0] : null
}