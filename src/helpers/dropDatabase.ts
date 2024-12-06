import pool from "../db";
import logger from "../logger";

const dropDatabase = async () => {
  const client = await pool.connect();
  try {
    logger.info("Starting database cleanup...");

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);

    const tables = result.rows.map((row) => row.table_name);

    if (tables.length === 0) {
      logger.info("No tables found to delete.");
      return;
    }

    await client.query("SET session_replication_role = 'replica';");
    for (const table of tables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
      logger.info(`Dropped table: ${table}`);
    }
    await client.query("SET session_replication_role = 'origin';");
    logger.info("Database cleanup complete.");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Database cleanup failed: ${error.message}`, { stack: error.stack });
    } else {
      logger.error("Database cleanup failed with an unknown error");
    }
  } finally {
    client.release();
  }
};

dropDatabase();
