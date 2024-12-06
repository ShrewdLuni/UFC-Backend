import { DatabaseFighter } from "../types/databaseTypes";
import { Fighter } from "../types/types";

export class FighterSerializer {
  private data: Partial<Fighter>;
  private instance: Fighter | null = null;

  constructor(data: any) {
    this.data = data;
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

    if (!reach || typeof reach !== 'number' || reach <= 0) {
      throw new Error("Reach field is required and must be a positive number.");
    }

    if (!stance || typeof stance !== 'string') {
      throw new Error("Stance field is required and must be a string.");
    }

    if (!dob || !this.isValidDate(dob)) {
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
      reach,
      stance,
      dob,
    };
  }

  private isValidDate(date: string): boolean {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  }

  toInstance(): Fighter {
    if (!this.instance) {
      throw new Error("Data has not been validated yet.");
    }
    return this.instance;
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