export default function isZero(x: string | number | bigint) {
  return BigInt(x) === 0n;
}
