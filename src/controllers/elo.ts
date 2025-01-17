import express from "express";
import { getElo, getEloById } from "../services/elo";
import { convertFiltersToSQL, convertOrderingToSql } from "../helpers/utils";

export const getEloByIdController = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  try {
    const eloRecord = await getEloById(+id)

    if(!eloRecord){
      return res.sendStatus(404);
    }
    
    return res.status(200).json(eloRecord).end();
    
  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
} 

export const getEloController = async (req: express.Request, res: express.Response) => {
  try {
    const rawOptions = (typeof req.query.options === 'string' ? req.query.options : '').split(',').filter(Boolean);
    
    const filters = req.query?.filters ? convertFiltersToSQL(req.query.filters) : "";
    const sorting = req.query?.sort_by ? convertOrderingToSql(req.query.sort_by) : [];
    const options = {includeFighterInfo: rawOptions.includes('includeFighterInfo')};

    const eloRecords = await getElo(filters, sorting, options);
    return res.status(200).json(eloRecords);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
