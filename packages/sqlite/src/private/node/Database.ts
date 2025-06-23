import Database from "#api/Database";
import defaults from "#api/defaults";
import type Options from "#api/Options";
import NodeStatement from "#node/Statement";
import { DatabaseSync as NodeSqlite } from "node:sqlite";

export default class extends Database {
  #opened = false;
  #client: NodeSqlite;
  #safeIntegers: boolean = false;

  constructor(path: string, options: Options = defaults) {
    super();
    this.#client = new NodeSqlite(path, {
      readOnly: options.readonly ?? false,
    });
    if (options.safeIntegers) {
      this.#safeIntegers = true;
    }
    this.#opened = true;
  }

  close() {
    if (this.#opened) {
      this.#client.close();
      this.#opened = false;
    }
    // noop if db already close
  }

  prepare(sql: string) {
    const statement = this.#client.prepare(sql);
    if (this.#safeIntegers) {
      statement.setReadBigInts(true);
    }
    return new NodeStatement(statement);
  }
}
