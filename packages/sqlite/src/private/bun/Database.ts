import Database from "#api/Database";
import type Options from "#api/Options";
import Statement from "#Statement";
import { Database as BunSqlite } from "bun:sqlite";

export default class extends Database {
  #client: BunSqlite;

  constructor(path: string, options: Options) {
    super(path, options);

    this.#client = new BunSqlite(path, options);
  }

  close() {
    this.#client.close();
  }

  query(sql: string) {
    return new Statement();
  }
}
