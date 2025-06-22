import Database from "#api/Database";
import defaults from "#api/defaults";
import type Options from "#api/Options";
import BunStatement from "#bun/Statement";
import { Database as BunSqlite } from "bun:sqlite";

export default class extends Database {
  #client: BunSqlite;

  constructor(path: string, options: Options = defaults) {
    super();
    this.#client = new BunSqlite(path,
      Object.keys(options).length === 0 ? undefined : options);
  }

  close() {
    this.#client.close();
  }

  prepare(sql: string) {
    return new BunStatement(this.#client.prepare(sql));
  }
}
