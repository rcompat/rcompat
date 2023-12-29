import { mkdir, realpath, open } from "node:fs/promises";
import Kind from "./Kind.js";

export default {
  [Kind.File]: async path => {
    await (await open(path, "w")).close();
  },
  [Kind.Directory]: async (path, { recursive } = {}) => {
    await mkdir(path, { recursive });
  },
  [Kind.Link]: async path => {
    new File(await realpath(path)).create();
  },
};
