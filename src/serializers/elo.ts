import { isValidDate } from "../helpers/utils";
import { DatabaseElo } from "../types/databaseTypes";
import { ExtendedElo } from "../types/extendedTypes";
import { Serializer } from "../abstract/serializer";

export class EloSerializer extends Serializer<DatabaseElo> {
  constructor(data: any) {
    super(data)
  }

  validate(): void {
    const { fighterId, type, weightClass, date, value } = this.data;

    if (!fighterId || typeof fighterId !== 'number' || fighterId <= 0) {
      throw new Error("Fighter Id field is required and must be a positive number.");
    }
  
    if (!type || typeof type !== 'string') {
      throw new Error("Type field is required and must be a string.");
    }
  
    if (!weightClass || typeof weightClass !== 'string') {
      throw new Error("Weight Calss field is required and must be a string.");
    }
  
    if (!date || !isValidDate(date)) {
      throw new Error("Date field must be a valid date.");
    }
  
    if (!value || typeof value !== 'number' || value <= 0) {
      throw new Error("Value field is required and must be a positive number.");
    }

    this.instance = {
      fighterId,
      type,
      weightClass,
      date,
      value,
    };
  }

  toDatabaseObject(): DatabaseElo {
    const instance = this.toInstance();
    return {
      fighterId: instance.fighterId,
      type: instance.type,
      weightClass: instance.weightClass,
      date: instance.date,
      value: instance.value,
    };
  }
}

export const serializeElo: (row: any) => DatabaseElo = (row: any): DatabaseElo => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    fighterId: row.fighter_id,
    type: row.type,
    weightClass: row.weight_class,
    date: row.date,
    value: row.value,
  };
}

export const serializeEloWithID: (row: any) => ExtendedElo = (row: any): ExtendedElo => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    id: row.id,
    fighterId: row.fighterId,
    type: row.type,
    weightClass: row.weightClass,
    date: row.date,
    value: row.value,
  };
}