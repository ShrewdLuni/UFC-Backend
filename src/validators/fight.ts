import { Validator } from "../abstract/validator";
import { ProvidedConstraint, TypeConstraint } from "../constraints";
import { Fight } from "../types/types";

export class FightValidator extends Validator<Fight>{
  public isValid(): void {
    const { winner, fighterOne, fighterTwo, weightClass, method, round, time } = this.data;

    this.validateString(winner, 'winner')

    this.validate(fighterOne,"Fighter one", [new ProvidedConstraint()])
    this.validate(fighterTwo,"Fighter two", [new ProvidedConstraint()])

    this.validate(fighterOne.id, "Fighter one id", [new ProvidedConstraint()])
    this.validate(fighterTwo.id, "Fighter two id", [new ProvidedConstraint()])

    this.validateString(weightClass, 'weightClass')

    this.validate(method, "method", [new ProvidedConstraint()])
    this.validate(method.name, "method name", [
      new ProvidedConstraint(),
      new TypeConstraint('string')
    ])
    this.validate(method.details, "method", [
      new ProvidedConstraint(),
      new TypeConstraint('string')
    ], { optional: true })

    this.validateNumber(round, 'round', { positive: true })
    this.validateString(time, 'time')

    this.validatedData = this.data;
  }
}