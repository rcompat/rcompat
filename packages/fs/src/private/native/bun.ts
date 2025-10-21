import type Native from "#native/type";
import type WritableInput from "#WritableInput";

const bun: Native = {
  arrayBuffer(path: string) {
    return Bun.file(path).arrayBuffer();
  },
  json(path: string) {
    return Bun.file(path).json();
  },
  stream(path: string) {
    return Bun.file(path).stream();
  },
  text(path: string) {
    return Bun.file(path).text();
  },
  async byteLength(path: string) {
    return Bun.file(path).size;
  },
  async write(path: string, input: WritableInput) {
    if (input instanceof Response) {
      await Bun.write(path, await input.arrayBuffer());
      return;
    }
    if (input instanceof ReadableStream) {
      await Bun.write(path, new Response(input));
      return;
    }
    await Bun.write(path, input);
  },
};

export default bun;
