import express from "express";
import { getEloByIdController, getEloController } from "../controllers/elo";

export const eloRouter = express.Router();

eloRouter.get("/elo", async (req, res) => {
  try {
    await getEloController(req, res)
  } catch (error) {
    console.log(error)
  }
})

eloRouter.get("/elo/:id", async (req, res) => {
  try {
    await getEloByIdController(req, res)
  } catch (error) {
    console.log(error)
  }
})