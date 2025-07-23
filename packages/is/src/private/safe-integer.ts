export default function isSafeInteger(x: unknown): x is number | bigint {
  try {
    return Number.isSafeInteger(Number(x));
  } catch {
    return false;
  }
}
