import { ValidationConstraint } from './interfaces';

export class TypeConstraint implements ValidationConstraint {
  constructor(private expectedType: string) {}

  validate(value: any, fieldName: string): void {
    if (typeof value !== this.expectedType) {
      throw new Error(`${fieldName} must be a ${this.expectedType}. Received: ${typeof value}`);
    }
  }
}