import { createReadStream } from "fs";
import {
  stream_target_path,
  encoding,
  high_water_mark,
  new_line_char,
  fallback_chunk_leftover,
} from "./constants.js";
import { city_measurements_map, upsert_city_measurements_map } from "./city_measurements_map.js";

let chunk_leftover = "";

export async function aggregate_records() {
  const readable_stream = createReadStream(stream_target_path, {
    encoding,
    highWaterMark: high_water_mark,
  });

  for await (const chunk of readable_stream) {
    const rows = chunk.split(new_line_char);
    if (chunk_leftover.length) {
      rows[0] = chunk_leftover + rows[0];
    }

    chunk_leftover = rows.pop() ?? fallback_chunk_leftover;

    rows.forEach(upsert_city_measurements_map);
  }

  return city_measurements_map;
}
