import { Validator } from "../abstract/validator";
import { DateConstraint, ProvidedConstraint, TypeConstraint } from "../constraints";
import { Event } from "../types/types";

export class EventValidator extends Validator<Event>{
  public isValid(): void {
    const {name, date, location} = this.data;

    this.validate(name, 'name', [
      new ProvidedConstraint(),
      new TypeConstraint("string")
    ]);

    this.validate(date, 'date',[
      new ProvidedConstraint(),
      new DateConstraint()
    ]);

    this.validate(location, 'location', [
      new ProvidedConstraint(),
      new TypeConstraint("string")
    ])

    this.validatedData = this.data
  }
}