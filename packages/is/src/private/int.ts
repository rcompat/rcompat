export default function isInt(x: unknown): x is number {
  if (typeof x === "number") return Number.isInteger(x);
  return false;
}
