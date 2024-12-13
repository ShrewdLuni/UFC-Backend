import { DatabaseFighter } from "../types/databaseTypes";
import { ExtenedFighter } from "../types/extendedTypes";
import { Fighter } from "../types/types";
import { Serializer } from "../abstract/serializer";
import { FighterValidator } from "../validators/fighter";

export class FighterSerializer extends Serializer<Fighter, DatabaseFighter>{
  constructor(data: any) {
    super(data)
  }

  validate(): void {
    const validator = new FighterValidator(this.data)
    validator.isValid()
    this.instance = validator.getValidatedData()
  }

  toDatabaseObject(): DatabaseFighter {
    const instance = this.toInstance();
    return {
      name: instance.name,
      nickname: instance.nickname,
      height: instance.height,
      weight: instance.weight,
      reach: instance.reach,
      stance: instance.stance,
      dob: instance.dob,
    };
  }
}

export const serializeFighter: (row: any) => Fighter = (row: any): Fighter => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    name: row.name,
    nickname: row.nickname || null,
    height: row.height,
    weight: row.weight,
    reach: row.reach,
    stance: row.stance,
    dob: row.dob,
  };
}

export const serializeFighterWithID: (row: any) => ExtenedFighter = (row: any): ExtenedFighter => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    id: row.id,
    name: row.name,
    nickname: row.nickname || null,
    height: row.height,
    weight: row.weight,
    reach: row.reach,
    stance: row.stance,
    dob: row.dob,
  };
}