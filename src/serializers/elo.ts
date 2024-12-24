import { DatabaseElo } from "../types/databaseTypes";
import { ExtendedElo } from "../types/extendedTypes";
import { Serializer } from "../abstract/serializer";
import { EloValidator } from "../validators/elo";

export class EloSerializer extends Serializer<DatabaseElo> {
  constructor(data: any) {
    super(data)
  }

  validate(): void {
    const validator = new EloValidator(this.data)
    validator.isValid()
    this.instance = validator.getValidatedData()
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