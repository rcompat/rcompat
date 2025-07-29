export default function cstring(value: string): Deno.PointerValue {
  const buffer = new Uint8Array(new TextEncoder().encode(`${value}\0`));
  return Deno.UnsafePointer.of(buffer);
}
