import express from "express";
import { getElo, getEloById } from "../services/elo";

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

export const getAllEloRecordsController = async (req: express.Request, res: express.Response) => {
  try {
    const eloRecords = await getElo();
    return res.status(200).json(eloRecords);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
