import isInteger from "#integer";

export default function isUint(x: unknown): x is number | bigint {
  return isInteger(x) && BigInt(x) > 0n;
}
