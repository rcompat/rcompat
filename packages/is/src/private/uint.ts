import int from "#int";

export default function isUint(x: unknown): x is bigint | number {
  return int(x) && BigInt(x) > 0n;
}
