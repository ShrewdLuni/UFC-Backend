import express from "express";
import logging from "./middleware/logging";
import logger from "./logger";
import { router } from "./routes";

const app = express();
const PORT = 3000;

app.use(logging)

app.use("/api", router)

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
});
