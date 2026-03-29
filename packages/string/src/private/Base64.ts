const encoder = new TextEncoder();
const decoder = new TextDecoder();

export default {
  encode: (decoded: string): string => {
    return encoder.encode(decoded).toBase64();
  },
  decode: (encoded: string): string => {
    return decoder.decode(Uint8Array.fromBase64(encoded));
  },
};
