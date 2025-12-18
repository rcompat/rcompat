import type PrimitiveParam from "#api/PrimitiveParam";
import type { Dict } from "@rcompat/type";

type Param = Dict<PrimitiveParam> | PrimitiveParam;

export type { Param as default };
