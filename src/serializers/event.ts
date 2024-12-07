import { DatabaseEvent } from "../types/databaseTypes";
import { ExtendedEvent } from "../types/extendedTypes";
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

    this.instance = {
      name,
      date,
      location,
      fights: fights || [],
    };
  }
  
  private isValidDate(date: string): boolean {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  }

  toInstance(): Event {
    if (!this.instance) {
      throw new Error("Data has not been validated yet.");
    }
    return this.instance;
  }

  toDatabaseObject(): DatabaseEvent {
    const instance = this.toInstance();
    return {
      name: instance.name,
      date: instance.date,
      location: instance.location,
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

export const serializeEventWithID: (row: any) => ExtendedEvent = (row: any): ExtendedEvent => {
  if (!row) {
    throw new Error("Row data cannot be null or undefined.");
  }
  return {
    id: row.id,
    name: row.name,
    date: row.date,
    location: row.location,
  };
}