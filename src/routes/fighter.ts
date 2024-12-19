import express from "express";
import { getFighterByIdController, getFightersController } from "../controllers/fighter";

export const fighterRouter = express.Router();

fighterRouter.get("/fighter", async (req, res) => {
  try {
    await getFightersController(req, res)
  } catch (error) {
    console.log(error)
  }
})

fighterRouter.get("/fighters/:id", async (req, res) => {
  try {
    await getFighterByIdController(req, res)
  } catch (error) {
    console.log(error)
  }
})