import { Measurements } from "./Storage.js";

export class Transformer {
  private round_toward_positive(number: number): number {
    return Math.round((number + 1e-12) * 10) / 10;
  }

  exec(city: string, measurements: Measurements): string {
    const mean = measurements.sum / measurements.count;

    const rounded_min = this.round_toward_positive(measurements.min).toFixed(1);
    const rounded_max = this.round_toward_positive(measurements.max).toFixed(1);
    const rounded_mean = this.round_toward_positive(mean).toFixed(1);

    return `${city}=${rounded_min}/${rounded_mean}/${rounded_max}`;
  }
}
