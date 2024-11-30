import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_DATABASE) {
  throw new Error("Missing database environment variables");
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

export default pool;