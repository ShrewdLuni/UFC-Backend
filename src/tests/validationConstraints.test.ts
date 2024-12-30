import { ProvidedConstraint, TypeConstraint, PositiveConstraint, DateConstraint } from '../constraints';

describe('Validation Constraints', () => {
  describe('ProvidedConstraint', () => {
    const constraint = new ProvidedConstraint();

    it('should accept provided values', () => {
      expect(() => constraint.validate('test', 'field')).not.toThrow();
      expect(() => constraint.validate(0, 'field')).not.toThrow();
      expect(() => constraint.validate(false, 'field')).not.toThrow();
      expect(() => constraint.validate({}, 'field')).not.toThrow();
    });

    it('should reject undefined values', () => {
      expect(() => constraint.validate(undefined, 'field')).toThrow('field must be provided. Received: undefined');
    });

    it('should reject null values', () => {
      expect(() => constraint.validate(null, 'field')).toThrow('field must be provided. Received: null');
    });
  });

  describe('TypeConstraint', () => {
    it('should validate string type', () => {
      const constraint = new TypeConstraint('string');
      
      expect(() => constraint.validate('test', 'field')).not.toThrow();
      expect(() => constraint.validate(123, 'field')).toThrow('field must be a string. Received: number');
      expect(() => constraint.validate(true, 'field')).toThrow('field must be a string. Received: boolean');
    });

    it('should validate number type', () => {
      const constraint = new TypeConstraint('number');
      
      expect(() => constraint.validate(123, 'field')).not.toThrow();
      expect(() => constraint.validate('123', 'field')).toThrow('field must be a number. Received: string');
      expect(() => constraint.validate(true, 'field')).toThrow('field must be a number. Received: boolean');
    });

    it('should validate boolean type', () => {
      const constraint = new TypeConstraint('boolean');
      
      expect(() => constraint.validate(true, 'field')).not.toThrow();
      expect(() => constraint.validate(false, 'field')).not.toThrow();
      expect(() => constraint.validate('true', 'field')).toThrow('field must be a boolean. Received: string');
    });

    it('should validate object type', () => {
      const constraint = new TypeConstraint('object');
      
      expect(() => constraint.validate({}, 'field')).not.toThrow();
      expect(() => constraint.validate([], 'field')).not.toThrow();
      expect(() => constraint.validate('{}', 'field')).toThrow('field must be a object. Received: string');
    });
  });

  describe('PositiveConstraint', () => {
    const constraint = new PositiveConstraint();

    it('should accept positive numbers', () => {
      expect(() => constraint.validate(1, 'field')).not.toThrow();
      expect(() => constraint.validate(0, 'field')).not.toThrow();
      expect(() => constraint.validate(1000.5, 'field')).not.toThrow();
    });

    it('should reject negative numbers', () => {
      expect(() => constraint.validate(-1, 'field')).toThrow('field must be a positive number. Received: -1');
      expect(() => constraint.validate(-0.5, 'field')).toThrow('field must be a positive number. Received: -0.5');
    });

    it('should handle non-number values', () => {
      expect(() => constraint.validate('1' as any, 'field')).not.toThrow();
    });
  });

  describe('DateConstraint', () => {
    const constraint = new DateConstraint();

    it('should accept valid dates', () => {
      expect(() => constraint.validate(new Date(), 'field')).not.toThrow();
      expect(() => constraint.validate(new Date('2024-01-01'), 'field')).not.toThrow();
    });

    it('should reject invalid dates', () => {
      expect(() => constraint.validate('not a date', 'field')).toThrow('field must be a valid date');
      expect(() => constraint.validate({}, 'field')).toThrow('field must be a valid date');
      expect(() => constraint.validate(new Date('invalid'), 'field')).toThrow('field must be a valid date');
    });

    it('should reject null and undefined', () => {
      expect(() => constraint.validate(null, 'field')).toThrow('field must be a valid date');
      expect(() => constraint.validate(undefined, 'field')).toThrow('field must be a valid date');
    });
  });

  describe('Constraint Combinations', () => {
    it('should work with multiple constraints', () => {
      const constraints = [
        new ProvidedConstraint(),
        new TypeConstraint('number'),
        new PositiveConstraint()
      ];

      expect(() => {
        constraints.forEach(constraint => constraint.validate(5, 'field'));
      }).not.toThrow();

      expect(() => {
        constraints.forEach(constraint => constraint.validate('5', 'field'));
      }).toThrow('field must be a number');

      expect(() => {
        constraints.forEach(constraint => constraint.validate(null, 'field'));
      }).toThrow('field must be provided');

      expect(() => {
        constraints.forEach(constraint => constraint.validate(-5, 'field'));
      }).toThrow('field must be a positive number');
    });
  });
});