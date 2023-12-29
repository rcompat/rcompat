import { mkdir, realpath, open } from "node:fs/promises";
import Kind from "./Kind.js";
import FSFile from "./File.js";

export default {
  [Kind.File]: async path => {
    await (await open(path, "w")).close();
  },
  [Kind.Directory]: async (path, { recursive } = {}) => {
    await mkdir(path, { recursive });
  },
  [Kind.Link]: async path => {
    new FSFile(await realpath(path)).create();
  },
};
