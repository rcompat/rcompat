import Database from "#api/Database";
import defaults from "#api/defaults";
import type Options from "#api/Options";
import Statement from "#Statement";
import { Database as BunSqlite } from "bun:sqlite";

export default class extends Database {
  #client: BunSqlite;

  constructor(path: string, options: Options = defaults) {
    super(path, options);

    this.#client = new BunSqlite(path, 
      Object.keys(options).length === 0 ? undefined : options);
  }

  close() {
    this.#client.close();
  }

  query(sql: string) {
    return new Statement();
  }
}
