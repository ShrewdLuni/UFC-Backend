import express from "express";
import { getFighters, getFighterById } from "../services/fighter";
import { convertFiltersToSQL } from "../helpers/utils";

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
    const fighters = await getFighters(convertFiltersToSQL(req.query.filters));
    return res.status(200).json(fighters);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}