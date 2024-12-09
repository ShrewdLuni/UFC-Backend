import { DatabaseFight } from "../types/databaseTypes";
import { ExtenedFight, FightForEloCalculation } from "../types/extendedTypes";
import { Fight } from "../types/types";

export class FightSerializer {
  private data: Partial<Fight>;
  private instance: Fight | null = null;

  constructor(data: any) {
    this.data = data;
  }

  validate(): void {
    const { winner, fighterOne, fighterTwo, weightClass, method, round, time } = this.data;

    if (!winner || typeof winner !== "string") {
      throw new Error("Winner field is required and must be a string.");
    }

    if (!fighterOne || !fighterTwo) {
      const message = !fighterOne && !fighterTwo ? "Both Fighters" : !fighterOne ? "Fighter one" : "Fighter two"   
      throw new Error(`${message} info is missing.`)
    }

    if (!fighterOne.id || !fighterTwo.id){
      const message = !fighterOne.id && !fighterTwo.id ? "Both Fighters" : !fighterOne.id ? "Fighter one" : "Fighter two"   
      throw new Error(`${message} ID is missing.`)
    }

    if (!weightClass || typeof weightClass !== "string") {
      throw new Error("Weight Class field is required and must be a string.");
    }

    if (!method) {
      throw new Error("Method field is required")
    }

    if (!method.name || typeof method.name !== "string") {
      throw new Error("Method Name field is required and must be a string.")
    }

    if(method.details !== undefined && typeof method.details !== "string") {
      console.log(method.details !== "string", typeof method.details)
      throw new Error("Method Details field must be a string if provided.") 
    }

    if(!round || typeof round !== "number"){
      throw new Error("Round field must be a positive number.") 
    }

    if (!time || typeof time !== "string") {
      throw new Error("Time field is required and must be a string.")
    }

    this.instance = {
      winner,
      fighterOne,
      fighterTwo,
      weightClass,
      method,
      round,
      time
    };
  }

  toInstance(): Fight {
    if (!this.instance) {
      throw new Error("Data has not been validated yet.");
    }
    return this.instance;
  }

  toDatabaseObject(): DatabaseFight {
    const instance = this.toInstance();
    return {
      eventId: 0,
      winner: instance.winner,
      fighterOneId: instance.fighterOne.id!,
      fighterTwoId: instance.fighterTwo.id!,
      winnerId: instance.fighterOne.id!,
      weightClass: instance.weightClass,
      methodName: instance.method.name,
      methodDetails: instance.method.details || null,
      round: instance.round,
      time: instance.time,
    };
  }
}

export const serializeFight: (row: any) => Fight = (row: any): Fight => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    winner: row.winner,
    fighterOne: row.fighterOne,
    fighterTwo: row.fighterTwo,
    weightClass: row.weightClass,
    method: row.method,
    round: row.round,
    time: row.time,
  };
}

export const serializeFightWithID: (row: any) => ExtenedFight = (row: any): ExtenedFight => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    id: row.id,
    eventId: row.event_id,
    fighterOneId: row.fighter_one_id,
    fighterTwoId: row.fighter_two_id,
    winner: row.winner,
    winnerId: row.winner_id,
    methodName: row.method,
    methodDetails: row.method_details,
    weightClass: row.weight_class,
    round: row.round,
    time: row.time,
  };
}

export const serializeFightForEloCalculation: (row: any) => FightForEloCalculation = (row: any): FightForEloCalculation => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    id: row.id,
    eventId: row.event_id,
    fighterOneId: row.fighter_one_id,
    fighterTwoId: row.fighter_two_id,
    winner: row.result,
    winnerId: row.winner_id,
    methodName: row.method,
    methodDetails: row.method_details,
    weightClass: row.weight_class,
    round: row.round,
    time: row.time,
    date: row.event_date,
  };
}