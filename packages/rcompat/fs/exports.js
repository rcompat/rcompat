export { default as Blob } from "./Blob.js";
export { default as File } from "./File.js";
export { default as Kind } from "./Kind.js";
export { watch } from "node:fs";

const s_streamable = Symbol.for("rcompat/fs.streamable");

export { s_streamable };
