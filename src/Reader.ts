import { createReadStream, type PathLike, type ReadStream } from "node:fs";
import { Aggregator } from "./Aggregator.js";

export interface ReaderConfig {
  path: PathLike;
  chunk_size_bytes: number;
}

export class Reader {
  private readonly stream: ReadStream;
  private readonly aggregator: Aggregator;

  constructor(config: ReaderConfig, aggregator: Aggregator) {
    this.stream = createReadStream(config.path, {
      encoding: "utf-8",
      highWaterMark: config.chunk_size_bytes,
    });

    this.aggregator = aggregator;
  }

  async exec() {
    let leftover = "";

    for await (const chunk of this.stream as AsyncIterable<string>) {
      const parts = (leftover + chunk).split("\n");
      leftover = parts.pop() ?? "";

      for (let i = 0; i < parts.length; i++) {
        const row = parts[i].endsWith("\r") ? parts[i].slice(0, -1) : parts[i];
        if (row) {
          this.aggregator.exec(row);
        }
      }
    }

    if (leftover) {
      this.aggregator.exec(leftover.endsWith("\r") ? leftover.slice(0, -1) : leftover);
    }
  }
}
