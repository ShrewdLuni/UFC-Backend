import { DatabaseFight } from "../types/databaseTypes";
import { ExtenedFight, FightForEloCalculation } from "../types/extendedTypes";
import { Fight } from "../types/types";
import { Serializer } from "../abstract/serializer";
import { FightValidator } from "../validators/fight";

export class FightSerializer extends Serializer<Fight, DatabaseFight> {
  constructor(data: any) {
    super(data)
  }

  validate(): void {
    const validator = new FightValidator(this.data)
    validator.isValid()
    this.instance = validator.getValidatedData()
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