import type UnknownFunction from "@rcompat/type/UnknownFunction"

type TypeofTypeMap = {
  string: string,
  number: number,
  bigint: bigint,
  boolean: boolean,
  symbol: symbol,
  function: UnknownFunction
  undefined: undefined
}

export type { TypeofTypeMap as default };
