import { DateConstraint, PositiveConstraint, ProvidedConstraint, TypeConstraint, ValidationConstraint } from "../constraints";

export abstract class Validator<T> {
  protected data: any;
  protected validatedData?: T;

  constructor(data: any) {
    this.data = data;
  }

  public abstract isValid(): void;

  public getValidatedData(): T {
    if(!this.validatedData) {
      throw new Error("Data has not been validated yet.")
    }
    return this.validatedData;
  }

  protected validate(
    value: any, 
    fieldName: string, 
    constraints: ValidationConstraint[] = [],
    options: { optional?: boolean } = {}
  ): void {
    const { optional = false } = options;
    if (optional && (value === undefined || value === null)) return;
    constraints.forEach(constraint => constraint.validate(value, fieldName));
  }

  protected validateString(value: any, fieldName: string, options: { optional?: boolean } = {}): void {
    this.validate(value, fieldName, [
      new ProvidedConstraint(),
      new TypeConstraint('string')
    ], options);
  }

  protected validateNumber(value: any, fieldName: string, options: { optional?: boolean, positive?: boolean } = {}): void {
    const constraints = [
      new ProvidedConstraint(),
      new TypeConstraint('number')
    ];

    if (options.positive) {
      constraints.push(new PositiveConstraint());
    }

    this.validate(value, fieldName, constraints, options);
  }

  protected validateDate(value: any, fieldName: string, options: { optional?: boolean } = {}): void {
    this.validate(value, fieldName, [
      new ProvidedConstraint(),
      new DateConstraint()
    ], options);
  }
}