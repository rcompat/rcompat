import type PrimitiveParam from "#api/PrimitiveParam";
import type Dict from "@rcompat/type/Dict";

type Param = Dict<PrimitiveParam> | PrimitiveParam;

export type { Param as default };
