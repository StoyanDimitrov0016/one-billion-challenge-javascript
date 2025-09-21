import { semicolon_char } from "./constants.js";

export interface Measurement {
  min: number;
  max: number;
  sum: number;
  count: number;
}

export const city_measurements_map = new Map<string, Measurement>();

function extract_measurement_values(row: string) {
  let city = "";
  let temperature_as_string = "";
  let is_semicolon_achieved = false;

  for (let index = 0; index < row.length; index++) {
    const char = row[index];

    if (char === semicolon_char) {
      is_semicolon_achieved = true;
      continue;
    }
    if (!is_semicolon_achieved) {
      city += char;
      continue;
    }
    if (is_semicolon_achieved) {
      temperature_as_string += char;
    }
  }

  return { city, temp: Number(temperature_as_string) };
}

export function upsert_city_measurements_map(row: string) {
  const { city, temp } = extract_measurement_values(row);

  const measurements = city_measurements_map.get(city);

  if (!measurements) {
    city_measurements_map.set(city, { min: temp, max: temp, sum: temp, count: 1 });
    return;
  }

  measurements.min = Math.min(measurements.min, temp);
  measurements.max = Math.max(measurements.max, temp);
  measurements.sum += temp;
  measurements.count++;

  city_measurements_map.set(city, measurements);
}

export function clear_city_measurements_map() {
  city_measurements_map.clear();
}
