// @ts-expect-error jsr
import { Database as DenoSqlite } from "jsr:@db/sqlite@0.11";
import Database from "#Database";
import type Options from "#Options";
import Statement from "#Statement";

export default class extends Database {
  #opened = false;
  #client: DenoSqlite;

  constructor(path: string, options: Options) {
    super(path, options);

    this.#client = new DenoSqlite(path, options);
    this.#opened = true;
  }

  close() {
    if (this.#opened) {
      this.#client.close();
      this.#opened = false;
    }
    // noop if db already close
  }

  query(sql: string) {
    return new Statement();
  }
}
