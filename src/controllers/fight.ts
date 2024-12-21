import express from "express";
import { getFights, getFightById } from "../services/fight";
import { convertFiltersToSQL, getFiltersFromQuery } from "../helpers/utils";

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
    const fights = await getFights(convertFiltersToSQL(getFiltersFromQuery(req.query)));
    return res.status(200).json(fights);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}