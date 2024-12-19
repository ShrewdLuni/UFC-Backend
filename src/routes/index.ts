import express from "express";
import { fighterRouter } from "./fighter";
import { fightRouter } from "./fight";
import { eventRouter } from "./event";
import { eloRouter } from "./elo";

export const router = express.Router();

router.use(eloRouter);
router.use(eventRouter);
router.use(fightRouter);
router.use(fighterRouter);