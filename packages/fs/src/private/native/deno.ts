import type Native from "#native/type";
import type WritableInput from "#WritableInput";

const deno: Native = {
  async arrayBuffer(path: string) {
    return (await Deno.readFile(path)).buffer;
  },
  async json(path: string) {
    return JSON.parse(await Deno.readTextFile(path));
  },
  stream(path: string) {
    return Deno.openSync(path, { read: true }).readable;
  },
  text(path: string) {
    return Deno.readTextFile(path);
  },
  write(path: string, input: WritableInput) {
    return input instanceof Blob
      ? Deno.writeFile(path, input.stream())
      : Deno.writeTextFile(path, input);
  },
}

export default deno;
