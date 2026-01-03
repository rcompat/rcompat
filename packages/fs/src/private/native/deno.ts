import type Native from "#native/type";
import type WritableInput from "#WritableInput";

const deno: Native = {
  async arrayBuffer(path: string) {
    const u8 = await Deno.readFile(path);
    return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
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
  async size(path: string) {
    return (await Deno.stat(path)).size;
  },
  async write(path: string, input: WritableInput) {
    if (typeof input === "string") return await Deno.writeTextFile(path, input);

    // normalise to Uint8Array
    let out: Uint8Array;

    if (input instanceof ReadableStream) {
      out = await new Response(input).bytes();
    } else if (input instanceof Blob || input instanceof Response) {
      out = await input.bytes();
    } else if (input instanceof ArrayBuffer) {
      out = new Uint8Array(input);
    } else {
      // unnormalised Uint8Array
      out = input;
    }

    await Deno.writeFile(path, out);
  },
};

export default deno;
