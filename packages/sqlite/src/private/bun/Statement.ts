import type Param from "#api/Param";
import type PrimitiveParam from "#api/PrimitiveParam";
import type Statement from "#api/Statement";
import type { Statement as BunStatement } from "bun:sqlite";
import type Changes from "#api/Changes";

export default class implements Statement {
  #statement: BunStatement;

  constructor(statement: BunStatement) {
    this.#statement = statement;
  }

  get(first?: Param, ...rest: PrimitiveParam[]) {
    return this.#statement.get(first, ...rest);
  }

  all(first?: Param, ...rest: PrimitiveParam[]) {
    return this.#statement.all(first, ...rest);
  }

  run(first?: Param, ...rest: PrimitiveParam[]): Changes {
    return this.#statement.run(first, ...rest);
  }
};
