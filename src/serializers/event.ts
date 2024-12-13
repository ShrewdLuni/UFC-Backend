import { DatabaseEvent } from "../types/databaseTypes";
import { ExtendedEvent } from "../types/extendedTypes";
import { Event } from "../types/types";
import { Serializer } from "../abstract/serializer";
import { EventValidator } from "../validators/event";

export class EventSerializer extends Serializer<Event, DatabaseEvent> {
  constructor(data: any) {
    super(data)
  }

  validate(): void {
    const validator = new EventValidator(this.data)
    validator.isValid();

    const { name, date, location, fights } = this.data;
    this.instance = {
      name: name!,
      date: date!,
      location: location!,
      fights: fights || [],
    };
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