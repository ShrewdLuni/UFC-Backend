import express from "express";
import { getEvents, getEventById } from "../services/event";
import { convertFiltersToSQL } from "../helpers/utils";

export const getEventByIdController = async(req: express.Request, res: express.Response) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  try {
    const event = await getEventById(+id)

    if (!event) {
      return res.sendStatus(400);
    }
    
    return res.status(200).json(event).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);    
  }
}

export const getEventsController = async (req: express.Request, res: express.Response) => {
  try {
    const filters = req.query?.filters ? convertFiltersToSQL(req.query.filters) : " ";

    const rawOptions = (typeof req.query.options === 'string' ? req.query.options : '').split(',').filter(Boolean);
    const options = {includeFightsInfo: rawOptions.includes('includeFightsInfo'), includeFightersNames: rawOptions.includes('includeFightersNames'),};

    const events = await getEvents(filters, options);
    return res.status(200).json(events)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
}