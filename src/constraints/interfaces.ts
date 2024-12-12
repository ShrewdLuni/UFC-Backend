export interface ValidationConstraint {
  validate(value: any, fieldName: string): void;
}