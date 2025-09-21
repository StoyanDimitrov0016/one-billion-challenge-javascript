import { main } from "./main.js";
import { clear_city_measurements_map } from "./city_measurements_map.js";

const results: number[] = [];

async function index() {
  const start = performance.now();
  await main();
  const end = performance.now();

  results.push(+(end - start).toFixed(1));
  clear_city_measurements_map();
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
