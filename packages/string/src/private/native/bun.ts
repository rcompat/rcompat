import type Native from "#native/type";
import { Buffer } from 'node:buffer';

const bun: Native = {
  utf8ByteLength(str: string) {
    return Buffer.byteLength(str, "utf8");
  },
};

export default bun;
