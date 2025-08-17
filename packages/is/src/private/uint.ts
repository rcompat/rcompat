import isInteger from "#integer";

export default function isUint(x: unknown): x is bigint | number {
  return isInteger(x) && BigInt(x) > 0n;
}
