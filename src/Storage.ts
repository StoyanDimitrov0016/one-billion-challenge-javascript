export interface Measurements {
  min: number;
  max: number;
  sum: number;
  count: number;
}

export class Storage {
  private readonly storage: Map<string, Measurements>;

  constructor() {
    this.storage = new Map<string, Measurements>();
  }

  state() {
    return this.storage;
  }

  upsert(city: string, temp: number): void {
    const measurements = this.storage.get(city);

    if (!measurements) {
      this.storage.set(city, { min: temp, max: temp, sum: temp, count: 1 });
      return;
    }

    if (temp < measurements.min) measurements.min = temp;
    if (temp > measurements.max) measurements.max = temp;

    measurements.sum += temp;
    measurements.count++;
  }
}
