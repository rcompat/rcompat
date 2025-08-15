export default function isBlank(x: unknown): x is string {
  return typeof x === "string" && /^\s*$/.test(x);
}
