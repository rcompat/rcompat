export default function isEmpty(x: unknown) {
  if (typeof x === "string" || Array.isArray(x)) return x.length === 0;
  if (x instanceof Set || x instanceof Map) return x.size === 0;
  if (typeof x === "object" && x !== null) return Object.keys(x).length === 0;
  return false;
}
