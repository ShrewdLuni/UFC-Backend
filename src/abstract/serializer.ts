abstract class Serializer<T, DB> {
  private data: Partial<T>;
  private instance: T | null = null;

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