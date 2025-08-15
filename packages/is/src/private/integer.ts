export default function isInteger(x: unknown): x is number {
  if (typeof x === "number") return Number.isInteger(x);

  return false;
}
