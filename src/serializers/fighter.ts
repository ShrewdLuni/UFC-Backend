import { isValidDate } from "../helpers/utils";
import { DatabaseFighter } from "../types/databaseTypes";
import { ExtenedFighter } from "../types/extendedTypes";
import { Fighter } from "../types/types";
import { Serializer } from "../abstract/serializer";

export class FighterSerializer extends Serializer<Fighter, DatabaseFighter>{
  constructor(data: any) {
    super(data)
  }

  validate(): void {
    const { name, height, weight, reach, stance, dob, nickname } = this.data;

    if (!name || typeof name !== 'string') {
      throw new Error("Name field is required and must be a string.");
    }

    if (!height || typeof height !== 'number' || height <= 0) {
      throw new Error("Height field is required and must be a positive number.");
    }

    if (!weight || typeof weight !== 'number' || weight <= 0) {
      throw new Error("Weight field is required and must be a positive number.");
    }

    if (reach !== undefined && (typeof reach !== 'number' || reach <= 0)) {
      throw new Error("Reach field must be a positive number if provided.");
    }

    if (stance !== undefined && typeof stance !== 'string') {
      throw new Error("Stance field must be a string if provided.");
    }

    if (!dob || !isValidDate(dob)) {
      throw new Error("DOB field must be a valid date.");
    }

    if (nickname !== undefined && typeof nickname !== 'string') {
      throw new Error("Nickname field must be a string if provided.");
    }

    this.instance = {
      name,
      nickname: nickname || null,
      height,
      weight,
      reach: reach || 0,
      stance: stance || "No info",
      dob,
    };
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