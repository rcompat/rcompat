export type AnyConstructibleFunction = new (...args: never) => unknown;

export type AnyFunction = (...args: readonly unknown[]) => unknown;
 
export type TypeofTypeMap = {
  string: string,
  number: number,
  bigint: bigint,
  boolean: boolean,
  symbol: symbol,
  function: AnyFunction
  undefined: undefined
}
