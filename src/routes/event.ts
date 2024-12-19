import express from "express";
import { getEventByIdController, getEventsController } from "../controllers/event";

export const eventRouter = express.Router();

eventRouter.get("/events/", async (req, res) => {
  try {
    console.log(1)
    await getEventsController(req, res)
  } catch (error) {
    console.log(error)
  }
})

eventRouter.get("/events/:id", async (req, res) => {
  try {
    await getEventByIdController(req, res)
  } catch (error) {
    console.log(error)
  }
})