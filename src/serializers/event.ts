import { Event } from "../types/types";

export class EventSerializer {
  private data: Partial<Event>;
  private instance: Event | null = null;

  constructor(data: any) {
    this.data = data;
  }

  validate(): void {
    const { name, date, location, fights } = this.data;

    if (!name || typeof name !== "string") {
      throw new Error("Name field is required and must be a string.");
    }

    if (!date || !this.isValidDate(date)) {
      throw new Error("Date field is required and must be a string.");
    }

    if(!location || typeof location !== "string"){
      throw new Error("Location field is required and must be a string.") 
    }

    if(!fights){
      throw new Error("Fights field can not be null.") 
    }

    this.instance = {
      name,
      date,
      location,
      fights
    };
  }

  toInstance(): Event {
    if (!this.instance) {
      throw new Error("Data has not been validated yet.");
    }
    return this.instance;
  }

  private isValidDate(date: string): boolean {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  }

  toDatabaseObject(): any {
    const instance = this.toInstance();
    return {
      name: instance.name,
      date: instance.date,
      location: instance.location,
      fights: instance.fights
    };
  }
}

export const serializeEvent: (row: any) => Event = (row: any): Event => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    name: row.name,
    date: row.date,
    location: row.location,
    fights: row.fights
  };
}