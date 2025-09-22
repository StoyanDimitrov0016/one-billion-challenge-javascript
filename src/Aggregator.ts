import { Storage } from "./Storage.js";

export class Aggregator {
  private readonly storage: Storage;
  private readonly divider: string;

  constructor(storage: Storage, divider: string) {
    this.storage = storage;
    this.divider = divider;
  }

  exec(row: string) {
    const divider_position = row.indexOf(this.divider);

    const city = row.slice(0, divider_position);
    const temp_as_string = row.slice(divider_position + 1);

    this.storage.upsert(city, parseFloat(temp_as_string));
  }
}
