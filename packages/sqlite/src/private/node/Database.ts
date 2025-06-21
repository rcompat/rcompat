import Database from "#Database";
import type Options from "#Options";
import Statement from "#Statement";
import { DatabaseSync as NodeSqlite } from "node:sqlite";

export default class extends Database {
  #opened = false;
  #client: NodeSqlite;

  constructor(path: string, options: Options) {
    super(path, options);

    this.#client = new NodeSqlite(path, {
      readOnly: options.readonly,
    });
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
