import { readFile } from "fs/promises";
import { main } from "./main.js";

const results: number[] = [];

async function index() {
  const start = performance.now();
  await main();
  const end = performance.now();

  const expected_result = await readFile(
    new URL("../weather_stations/measurements-100000.out", import.meta.url),
    {
      encoding: "utf-8",
    }
  );
  const current_result = await readFile(new URL("../output.txt", import.meta.url), {
    encoding: "utf-8",
  });

  const expected_rows = expected_result.split(", ");
  const current_rows = current_result.split(", ");

  for (let i = 0; i < expected_rows.length; i++) {
    const expected_row = expected_rows[i];
    const current_row = current_rows[i];

    if (expected_row !== current_row) {
      throw new Error(`\nReceived: ${current_row}\nExpected: ${expected_row}\nPosition: ${i++}`);
    }
  }

  results.push(+(end - start).toFixed(1));
}

const loops = 100;
for (let i = 0; i < loops; i++) {
  await index();
}

const times = results.sort((a, b) => a - b);
const median = times[Math.floor(times.length / 2)];
const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
const min = times[0];
const max = times[times.length - 1];

const current_rows = 100_000;
const target_rows = 1_000_000_000;
const factor = target_rows / current_rows;

function format(ms: number, scaleFactor = 1) {
  const total_ms = ms * scaleFactor;
  const seconds = total_ms / 1000;
  const minutes = seconds / 60;
  const hours = seconds / 3600;

  return {
    ms: Number(total_ms.toFixed(1)),
    seconds: Number(seconds.toFixed(1)),
    minutes: Number(minutes.toFixed(1)),
    hours: Number(hours.toFixed(2)),
  };
}

console.log("test loops:", loops);
console.table({
  "current run min": format(min),
  "current run median": format(median),
  "current run avg": format(avg),
  "current run max": format(max),
  "-": { ms: "-", seconds: "-", minutes: "-", hours: "-" },
  "estimated 1B median": format(median, factor),
  "estimated 1B avg": format(avg, factor),
});
