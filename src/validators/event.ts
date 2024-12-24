import { Validator } from "../abstract/validator";
import { Event } from "../types/types";

export class EventValidator extends Validator<Event>{
  public isValid(): void {
    const { name, date, location } = this.data;

    this.validateString(name, 'name')
    this.validateDate(date, 'date')
    this.validateString(location, 'location')

    this.validatedData = this.data
  }
}