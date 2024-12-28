import { Validator } from "../abstract/validator";

describe('Abstract Validator', () => {
  class TestValidator extends Validator<any> {
    public isValid(): void {
      this.validateString('test', 'testField');
      this.validateNumber(1, 'numberField', { positive: true });
      this.validateDate(new Date(), 'dateField');
      this.validatedData = this.data;
    }

    public testValidateString(value: any, fieldName: string, options = {}) {
      return this.validateString(value, fieldName, options);
    }

    public testValidateNumber(value: any, fieldName: string, options = {}) {
      return this.validateNumber(value, fieldName, options);
    }
    
    public testValidateDate(value: any, fieldName: string, options = {}) {
      return this.validateDate(value, fieldName, options);
    }
  }

  describe('Built-in validation methods', () => {
    let validator: TestValidator;

    beforeEach(() => {
      validator = new TestValidator({});
    });

    describe('String validation', () => {
      it('should accept valid strings', () => {
        expect(() => validator.testValidateString("test", "field")).not.toThrow();
      });

      it('should reject numbers', () => {
        expect(() => validator.testValidateString(123, "field")).toThrow("field must be a string. Received: number");
      });

      it('should handle optional strings', () => {
        expect(() => validator.testValidateString(undefined, "field", { optional: true })).not.toThrow();
      });

      it('should reject null values', () => {
        expect(() => validator.testValidateString(null, "field")).toThrow("field must be provided");
      });
    });

    describe('Number validation', () => {
      it('should accept valid numbers', () => {
        expect(() => validator.testValidateNumber(123, "field")).not.toThrow();
      });

      it('should reject strings', () => {
        expect(() => validator.testValidateNumber("123", "field")).toThrow("field must be a number. Received: string");
      });

      it('should handle positive number constraint', () => {
        expect(() => validator.testValidateNumber(-1, "field", { positive: true })).toThrow("field must be a positive number. Received: -1");
      });
    });

    describe('Date validation', () => {
      it('should accept valid dates', () => {
        expect(() => validator.testValidateDate(new Date(), "field")).not.toThrow();
      });

      it('should reject invalid dates', () => {
        expect(() => validator.testValidateDate("not a date", "field")).toThrow("field must be a valid date");
      });

      it('should handle optional dates', () => {
        expect(() => validator.testValidateDate(undefined, "field", { optional: true })).not.toThrow();
      });
    });
  });
});