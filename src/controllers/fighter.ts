import express from "express";
import { getFighters, getFighterById } from "../services/fighter";
import { convertOrderingToSql, convertFiltersToSQL } from "../helpers/utils";

export const getFighterByIdController = async(req: express.Request, res: express.Response) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  try {
    const fighter = await getFighterById(+id)

    if(!fighter){
      return res.sendStatus(404);
    }
    
    return res.status(200).json(fighter).end();
    
  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
}

export const getFightersController = async (req: express.Request, res: express.Response) => {
  try {
    const rawOptions = (typeof req.query.options === 'string' ? req.query.options : '').split(',').filter(Boolean);

    const filters = req.query?.filters ? convertFiltersToSQL(req.query.filters) : "";
    const sorting = req.query?.sort_by ? convertOrderingToSql(req.query.sort_by) : [];
    const options = {includeEloHistory: rawOptions.includes('includeEloHistory'), includeEventsInfo: rawOptions.includes('includeEventsInfo'),};

    const fighters = await getFighters(filters, sorting, options);
    return res.status(200).json(fighters);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}