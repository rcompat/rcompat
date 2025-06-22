import type Changes from "#api/Changes";
import type Param from "#api/Param";
import type PrimitiveParam from "#api/PrimitiveParam";
import type Statement from "#api/Statement";
import type { StatementSync as NodeStatement } from "node:sqlite";

export default class implements Statement {
  #statement: NodeStatement;

  constructor(statement: NodeStatement) {
    this.#statement = statement;
  }

  get(first?: Param, ...rest: PrimitiveParam[]) {
    if (first === undefined) {
      return this.#statement.get();
    }
    if (typeof first === "object" && first !== null) {
      return this.#statement.get(first, ...rest);
    }
    return this.#statement.get(first, ...rest);
  }

  all(first?: Param, ...rest: PrimitiveParam[]) {
    if (first === undefined) {
      return this.#statement.all();
    }
    if (typeof first === "object" && first !== null) {
      return this.#statement.all(first, ...rest);
    }
    return this.#statement.all(first, ...rest);
  }

  run(first?: Param, ...rest: PrimitiveParam[]): Changes {
    if (first === undefined) {
      return this.#statement.run();
    }
    if (typeof first === "object" && first !== null) {
      return this.#statement.run(first, ...rest);
    }
    return this.#statement.run(first, ...rest);
  }
};
