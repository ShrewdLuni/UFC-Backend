import { Validator } from "../abstract/validator";
import { DatabaseElo } from "../types/databaseTypes";

export class EloValidator extends Validator<DatabaseElo> {
  public isValid(): void {
    const { fighterId, type, weightClass, date, value } = this.data;
    
    this.validateNumber(fighterId, "Fighter ID", { positive: true })
    this.validateString(type, "type")
    this.validateString(weightClass, "Weight Class")
    this.validateDate(date, "date")
    this.validateNumber(value, "value", { positive: true })
    this.validatedData = this.data
  }
}