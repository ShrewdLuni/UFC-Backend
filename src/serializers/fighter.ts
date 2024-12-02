import { Fighter } from "../types/types";

export const serializeFighter = (row: any): Fighter => {
  return {
    name: row.name,
    nickname: row.nickname,
    height: row.height,
    weight: row.weight,
    reach: row.reach,
    stance: row.stance,
    dob: row.dob,
  }
}