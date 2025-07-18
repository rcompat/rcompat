import type PrimitiveParam from "#api/PrimitiveParam";
import type Dict from "@rcompat/type/Dict";

type Param = PrimitiveParam | Dict<PrimitiveParam>;

export type { Param as default };
