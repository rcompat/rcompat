export default function utf8Size(string: string): number {
  let size = 0;

  for (const char of string) {
    const code = char.codePointAt(0)!;

    if (code <= 0x7f) {
      size++;
    } else if (code <= 0x7ff) {
      size += 2;
    } else if (code <= 0xffff) {
      size += 3;
    } else if (code <= 0x10ffff) {
      size += 4;
    } else {
      throw new Error(`Invalid code point: ${code}`);
    }
  }

  return size;
}
