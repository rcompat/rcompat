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
  async write(path: string, input: WritableInput) {
    await Bun.write(path, input);
  },
};

export default bun;
