import { isValidDate } from "../helpers/utils";
import { ValidationConstraint } from "./interfaces";

export class DateConstraint implements ValidationConstraint {
  validate(value: any, fieldName: string): void {
    if (!isValidDate(value)) {
      throw new Error(`${fieldName} must be a valid date. Received: ${value}`);
    }
  }
}