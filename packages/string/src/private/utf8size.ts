function utf8size(string: string): number {
  let size = 0;

  for (let i = 0; i < string.length; i++) {
    const code = string.codePointAt(i)!;

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

    if (code > 0xffff) {
      i++;
    }
  }

  return size;
}

export default utf8size;
