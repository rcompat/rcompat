export default function isNil(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}
