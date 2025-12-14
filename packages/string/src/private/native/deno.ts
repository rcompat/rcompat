import type Native from "#native/type";
import { Buffer } from 'node:buffer';

const deno: Native = {
  utf8_bytelength(str: string) {
    return Buffer.byteLength(str, "utf8");
  },
};

export default deno;
