import type WritableInput from "#WritableInput";

export default interface Native {
  arrayBuffer(path: string): Promise<ArrayBufferLike>;
  json(path: string): Promise<unknown>;
  stream(path: string): ReadableStream<Uint8Array<ArrayBufferLike>>;
  text(path: string): Promise<string>;
  write(path: string, input: WritableInput): Promise<void>;
};
