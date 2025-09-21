import { writeFile } from "node:fs/promises";
import { aggregate_records } from "./aggregate_records.js";
import type { Measurement } from "./city_measurements_map.js";
import { create_output_item } from "./create_output_item.js";

const output_path = new URL("../out.csv", import.meta.url);

type TempSortableItem = [city: string, min: number, mean: number, max: number];

function transform_to_sortable_array(temp_map: Map<string, Measurement>) {
  const out_array: TempSortableItem[] = [];

  for (const [city, { min, max, count, sum }] of temp_map) {
    const mean = sum / count;
    out_array.push([city, min, mean, max]);
  }

  return out_array;
}

export async function main() {
  const records = await aggregate_records();
  const sortable = transform_to_sortable_array(records);

  const parsed = sortable
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map((item) => create_output_item(item[0], item[1], item[2], item[3]))
    .join(", ");

  await writeFile(output_path, `{${parsed}}\n`, "utf8");
}
