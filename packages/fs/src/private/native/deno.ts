import type Native from "#native/type";
import type WritableInput from "#WritableInput";

const deno: Native = {
  async arrayBuffer(path: string) {
    return (await Deno.readFile(path)).buffer as ArrayBuffer;
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
  async byteLength(path: string) {
    return (await Deno.readFile(path)).byteLength;
  },
  async write(path: string, input: WritableInput) {
    if (input instanceof Blob || input instanceof Response) {
      return Deno.writeFile(path, new Uint8Array(await input.arrayBuffer()));
    }
    if (input instanceof ArrayBuffer) {
      return Deno.writeFile(path, new Uint8Array(input));
    }
    return Deno.writeTextFile(path, input);
  },
};

export default deno;
