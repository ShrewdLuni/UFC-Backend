import pool from "../db";
import logger from "../logger";
import { QueryBuilder } from "../queryBuilder";
import { FighterSerializer } from "../serializers/fighter";
import { Fighter } from "../types/types";

export const getFighters = async (filters : string = ""): Promise<Fighter[]> => {

  const includeFighterEloHistory = true;
  const includeFighterEvents = true;

  const queryBuilder = new QueryBuilder('fighter')
  .selectDistinct()
  .select('fighter.*')
  .where("fighter.name = 'Jon Jones'")
  .group('fighter.id')
  .order('fighter.name');


  if(includeFighterEvents){
    queryBuilder.jsonAgg('fights', {
      'id': 'fight.id',
      'event_id': 'fight.event_id',
      'fighter_one_id': 'fight.fighter_one_id',
      'fighter_two_id': 'fight.fighter_two_id',
      'result': 'fight.result',
      'winner_id': 'fight.winner_id',
      'method': 'fight.method',
      'method_details': 'fight.method_details',
      'weight_class': 'fight.weight_class',
      'round': 'fight.round',
      'time': 'fight.time',
      'event_name': 'event.name',
      'event_location': 'event.location',
      'event_date': 'event.date'
    }, { distinct: true })
    .join('JOIN fight ON (fight.fighter_one_id = fighter.id OR fight.fighter_two_id = fighter.id)')
    .join('JOIN event ON event.id = fight.event_id')
  }
  if(includeFighterEloHistory){
    queryBuilder.selectSubquery(
      `SELECT jsonb_agg(
        jsonb_build_object(
          'id', elo.id,
          'value', elo.value,
          'date', elo.date,
          'type', elo.type,
          'weight_class', elo.weight_class
        ) ORDER BY elo.date
      )
      FROM elo
      WHERE elo.fighter_id = fighter.id`,
      'elo_history'
    )
  }
  const result = await pool.query(queryBuilder.build());
  return result.rows
}

export const getFighterById = async (id: number): Promise<Fighter | null> => {
  const result = await pool.query("SELECT * FROM fighter WHERE id = $1", [id]);
  return result.rows.length ? result.rows[0] : null
}

export const getFighterByUniqueFields = async (name: string, dob: string) => {
  let validDob: string | null = dob
  if (dob === '--' || isNaN(Date.parse(dob))) {
    validDob = null;
  }

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