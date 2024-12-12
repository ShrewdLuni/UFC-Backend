import { ValidationConstraint } from './interfaces';

export class ProvidedConstraint implements ValidationConstraint {
  validate(value: any, fieldName: string): void {
    if (value === undefined || value === null) {
      throw new Error(`${fieldName} must be provided. Received: ${value}`);
    }
  }
}