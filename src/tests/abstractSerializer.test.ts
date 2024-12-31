import { Serializer } from "../abstract/serializer";

describe('Abstract Serializer', () => {
  class TestSerializer extends Serializer<{ name: string }, { name: string }> {
    public validate(): void {
      if (!this.data.name) {
        throw new Error("Validation failed: 'name' is required.");
      }
      this.instance = { name: this.data.name };
    }

    public toDatabaseObject(): { name: string } {
      if (!this.instance) {
        throw new Error("Data has not been validated yet.");
      }
      return { name: this.instance.name };
    }

    public testValidate() {
      return this.validate();
    }

    public testToInstance() {
      return this.toInstance();
    }

    public testToDatabaseObject() {
      return this.toDatabaseObject();
    }
  }

  describe('Serializer Methods', () => {
    let serializer: TestSerializer;

    beforeEach(() => {
      serializer = new TestSerializer({ name: "Test Name" });
    });

    describe('Validation', () => {
      it('should validate data successfully', () => {
        expect(() => serializer.testValidate()).not.toThrow();
        expect(serializer.testToInstance()).toEqual({ name: "Test Name" });
      });

      it('should throw an error when validation fails', () => {
        const invalidSerializer = new TestSerializer({});
        expect(() => invalidSerializer.testValidate()).toThrow("Validation failed: 'name' is required.");
      });
    });

    describe('toInstance', () => {
      it('should throw an error if called before validation', () => {
        expect(() => serializer.testToInstance()).toThrow("Data has not been validated yet.");
      });

      it('should return the instance after successful validation', () => {
        serializer.testValidate();
        expect(serializer.testToInstance()).toEqual({ name: "Test Name" });
      });
    });

    describe('toDatabaseObject', () => {
      it('should throw an error if called before validation', () => {
        expect(() => serializer.testToDatabaseObject()).toThrow("Data has not been validated yet.");
      });

      it('should return the database object after successful validation', () => {
        serializer.testValidate();
        expect(serializer.testToDatabaseObject()).toEqual({ name: "Test Name" });
      });
    });
  });
});
