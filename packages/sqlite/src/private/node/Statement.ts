import type Changes from "#api/Changes";
import type Param from "#api/Param";
import type PrimitiveParam from "#api/PrimitiveParam";
import type Statement from "#api/Statement";
import is from "@rcompat/is";
import type { Dict } from "@rcompat/type";
import type { StatementSync as NodeStatement } from "node:sqlite";

type Params = Dict<PrimitiveParam>;

export default class implements Statement {
  #statement: NodeStatement;

  constructor(statement: NodeStatement) {
    this.#statement = statement;
  }

  get(first?: Param, ...rest: PrimitiveParam[]) {
    if (is.undefined(first)) return this.#statement.get();
    if (is.dict(first)) return this.#statement.get(first as Params);
    return this.#statement.get(first, ...rest);
  }

  all(first?: Param, ...rest: PrimitiveParam[]) {
    if (is.undefined(first)) return this.#statement.all();
    if (is.dict(first)) return this.#statement.all(first as Params);
    return this.#statement.all(first, ...rest);
  }

  run(first?: Param, ...rest: PrimitiveParam[]): Changes {
    if (is.undefined(first)) return this.#statement.run();
    if (is.dict(first)) return this.#statement.run(first as Params);
    return this.#statement.run(first, ...rest);
  }
};
