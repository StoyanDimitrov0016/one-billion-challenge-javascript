import { Storage } from "./Storage.js";
import { Aggregator } from "./Aggregator.js";
import { Reader } from "./Reader.js";
import { Transformer } from "./Transformer.js";
import { Writer } from "./Writer.js";

export async function main() {
  const input_filename = "weather_stations/measurements-100000.txt" as const;
  const input_path = new URL(`../${input_filename}`, import.meta.url);

  const output_filename = "output.txt" as const;
  const output_path = new URL(`../${output_filename}`, import.meta.url);

  const storage = new Storage();
  const aggregator = new Aggregator(storage, ";");
  const reader = new Reader({ path: input_path, chunk_size_bytes: 262_144 }, aggregator);
  const transformer = new Transformer();
  const writer = new Writer(output_path);

  await reader.exec();

  const sorted_cities = Array.from(storage.state().keys()).sort();

  const map = storage.state();
  const output = sorted_cities.map((city) => transformer.exec(city, map.get(city)!)).join(", ");

  writer.exec("{" + output + "}\r\n");
}
