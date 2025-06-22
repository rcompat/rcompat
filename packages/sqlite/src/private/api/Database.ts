import type Param from "#api/Param";
import type PrimitiveParam from "#api/PrimitiveParam";
import type Statement from "#api/Statement";

export default abstract class Database {
  abstract close(): void;

  abstract prepare(sql: string): Statement;

  exec(sql: string, first?: Param, ...rest: PrimitiveParam[]) {
    return this.prepare(sql).run(first, ...rest);
  }
}
