import type Changes from "#api/Changes";
import type Param from "#api/Param";
import type PrimitiveParam from "#api/PrimitiveParam";

export default abstract class Statement {
  abstract get(first?: Param, ...rest: PrimitiveParam[]): unknown | null;

  abstract all(first?: Param, ...rest: PrimitiveParam[]): unknown[];

  abstract run(first?: Param, ...rest: PrimitiveParam[]): Changes;
}
