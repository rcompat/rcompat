export default function isFinite(x: unknown): x is bigint | number {
  if (typeof x === "bigint") return true;
  if (typeof x === "number") return Number.isFinite(x);
  return false;
}
