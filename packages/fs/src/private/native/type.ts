import type WritableInput from "#WritableInput";

export default interface Native {
  arrayBuffer(path: string): Promise<ArrayBuffer>;
  json(path: string): Promise<unknown>;
  stream(path: string): ReadableStream<Uint8Array>;
  text(path: string): Promise<string>;
  size(path: string): Promise<number>;
  write(path: string, input: WritableInput): Promise<void>;
};
