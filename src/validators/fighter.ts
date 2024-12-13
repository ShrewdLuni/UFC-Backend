import { Validator } from "../abstract/validator";
import { PositiveConstraint, ProvidedConstraint, TypeConstraint } from "../constraints";
import { Fighter } from "../types/types";

export class FighterValidator extends Validator<Fighter> {
  public isValid(): void {
    const { name, nickname, height, weight, reach, stance, dob } = this.data;
    this.validateString(name, 'name', { optional: false })
    this.validateString(nickname, 'nickname', { optional: true })
    this.validateNumber(height, 'height', { optional: true, positive: true })
    this.validateNumber(weight, 'weight', { optional: true, positive: true })
    this.validateNumber(reach, 'reach', { optional: true, positive: true })
    this.validateString(stance, 'stance', { optional: true })
    this.validateDate(dob, 'dob', { optional: true })
    this.validatedData = this.data;
  }
}