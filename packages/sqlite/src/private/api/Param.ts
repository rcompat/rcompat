import type PrimitiveParam from "#api/PrimitiveParam";

type Param = PrimitiveParam | Record<string, PrimitiveParam>;

export type { Param as default };
