import { type PathLike } from "node:fs";
import { writeFile } from "node:fs/promises";

export class Writer {
  private readonly path: PathLike;

  constructor(path: PathLike) {
    this.path = path;
  }

  async exec(output: string) {
    await writeFile(this.path, output);
  }
}
