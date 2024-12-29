import { ValidationConstraint } from "./interfaces";

export class PositiveConstraint implements ValidationConstraint {
  validate(value: any, fieldName: string): void {
    if (value < 0) {
      throw new Error(`${fieldName} must be a positive number. Received: ${value}`);
    }
  }
}