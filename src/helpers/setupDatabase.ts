import pool from "../db";
import logger from "../logger";

const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    //DB init here
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