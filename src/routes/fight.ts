import express from "express";
import { getFightByIdController, getFightsController } from "../controllers/fight";

export const fightRouter = express.Router();

fightRouter.get("/fights", async (req, res) => {
  try {
    await getFightsController(req, res)
  } catch (error) {
    console.log(error)
  }
})

fightRouter.get("/fights/:id", async (req, res) => {
  try {
    await getFightByIdController(req, res)
  } catch (error) {
    console.log(error)
  }
})