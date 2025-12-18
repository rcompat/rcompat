import type { UnknownFunction } from "@rcompat/type";

type TypeofTypeMap = {
  bigint: bigint;
  boolean: boolean;
  function: UnknownFunction;
  number: number;
  string: string;
  symbol: symbol;
  undefined: undefined;
};

export type { TypeofTypeMap as default };
