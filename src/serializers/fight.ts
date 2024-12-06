import { Fight } from "../types/types";

export class FighterSerializer {
  private data: Partial<Fight>;
  private instance: Fight | null = null;

  constructor(data: any) {
    this.data = data;
  }

  validate(): void {
    const { winner, fighterOne, fighterTwo, weightClass, method, round, time } = this.data;

    if (!winner || typeof winner !== "string") {
      throw new Error("Winner is required and must be a string.");
    }

    if (!fighterOne || !fighterTwo) {
      const message = !fighterOne && !fighterTwo ? "Both Fighters" : !fighterOne ? "Fighter one" : "Fighter two"   
      throw new Error(`${message} info is missing.`)
    }

    if (!weightClass || typeof weightClass !== "string") {
      throw new Error("Weight Class is required and must be a string.");
    }

    if (!method) {
      throw new Error("Method is required")
    }

    if (!method.name || typeof method.name !== "string") {
      throw new Error("Weight Class is required and must be a string.")
    }

    if(typeof method.details !== "string" && method.details !== null) {
      throw new Error("Method Details is must be a string.") 
    }

    if(!round || typeof round === "number"){
      throw new Error("Round must be a positive number.") 
    }

    if (!time || typeof time !== "string") {
      throw new Error("time is required and must be a string.")
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


  private isValidDate(date: string): boolean {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  }

  toDatabaseObject(): any {
    const instance = this.toInstance();
    return {
      winner: instance.winner,
      fighterOne: instance.fighterOne,
      fighterTwo: instance.fighterTwo,
      weightClass: instance.weightClass,
      method: instance.method,
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