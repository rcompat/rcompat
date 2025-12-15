export default function isSafeint(x: unknown): x is number {
  if (typeof x === "number") return Number.isSafeInteger(x);

  return false;
}
