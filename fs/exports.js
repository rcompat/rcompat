import { default as Blob } from "./Blob.js";
import { default as File } from "./File.js";
import { default as Kind } from "./Kind.js";
import { default as Router } from "./Router.js";
import { watch } from "node:fs";

const s_streamable = Symbol.for("rcompat/fs.streamable");

export {
  Blob,
  File,
  Kind,
  Router,
  s_streamable,
  watch,
};

export default {
  Blob,
  File,
  Kind,
  Router,
  s_streamable,
  watch,
};
