import express from "express";
import { getFights, getFightById } from "../services/fight";
import { convertFiltersToSQL } from "../helpers/utils";

export const getFightByIdController = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  try {
    const fight = await getFightById(+id)

    if(!fight){
      return res.sendStatus(404);
    }

    return res.status(200).json(fight).end();

  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
}

export const getFightsController = async (req: express.Request, res: express.Response) => {
  try {
    const rawOptions = (typeof req.query.options === 'string' ? req.query.options : '').split(',').filter(Boolean);

    const filters = req.query?.filters ? convertFiltersToSQL(req.query.filters) : " ";
    const options = {includeFighterInfo: rawOptions.includes('includeFighterInfo'), includeEventInfo: rawOptions.includes('includeEventInfo'),};

    const fights = await getFights(filters, options);
    return res.status(200).json(fights);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}