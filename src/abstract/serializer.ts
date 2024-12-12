export abstract class Serializer<T, DB = T> {
  protected data: Partial<T>;
  protected instance: T | null = null;

  constructor(data: Partial<T>) {
    this.data = data;
  }

  abstract validate(): void

  toInstance(): T {
    if(!this.instance) {
      throw new Error("Data has not been validated yet.")
    }
    return this.instance;
  }

  abstract toDatabaseObject(): DB
}