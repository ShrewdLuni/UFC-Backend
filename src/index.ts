import express from "express";
import pool from "./db";
import logging from "./middleware/logging";
import logger from "./logger";

const app = express();
const PORT = 3000;

app.use(logging)

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connection successful", time: result.rows[0].now });
    logger.info("Database connection succesful")
  } catch (error) {
    logger.error("Database connection error:", error)
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
});
