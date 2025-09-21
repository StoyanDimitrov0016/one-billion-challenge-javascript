export const new_line_char = "\n" as const;
export const semicolon_char = ";" as const;

export const encoding = "utf-8" as const;
export const high_water_mark = 262_144 as const;

const stream_target_filename = "weather_stations/measurements-100000.txt" as const;
export const stream_target_path = new URL(`../${stream_target_filename}`, import.meta.url);

export const fallback_chunk_leftover = "" as const;
