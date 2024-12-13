import pool from "../db";
import logger from "../logger";

const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS elo (
        id SERIAL PRIMARY KEY,
        fighter_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        weight_class TEXT,
        date DATE NOT NULL,
        value FLOAT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS fighter (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        nickname TEXT DEFAULT 'No nickname',
        height NUMERIC DEFAULT 0.0,
        weight NUMERIC DEFAULT 0.0,
        reach NUMERIC DEFAULT 0.0,
        stance TEXT DEFAULT 'unknown',
        dob DATE
      );
    
      ALTER TABLE elo 
      ADD CONSTRAINT elo_fighter_id_fkey 
      FOREIGN KEY (fighter_id) REFERENCES fighter(id) ON DELETE CASCADE;
      
      CREATE TABLE IF NOT EXISTS event (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT DEFAULT 'Unknown location',
        date DATE NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS fight (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
        fighter_one_id INTEGER NOT NULL REFERENCES fighter(id) ON DELETE CASCADE,
        fighter_two_id INTEGER NOT NULL REFERENCES fighter(id) ON DELETE CASCADE,
        result TEXT NOT NULL,
        winner_id INTEGER REFERENCES fighter(id),
        method TEXT,
        method_details TEXT,
        weight_class TEXT NOT NULL,
        round INTEGER,
        time TIME
      );
    `);
      
    logger.info("Database setup complete")
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Database setup failed: ${error.message}`, { stack: error.stack });
    } else {
      logger.error("Database setup failed with an unknown error");
    }
  } finally {
    client.release();
  }
}

setupDatabase();