import { rm, realpath } from "node:fs/promises";
import Kind from "./Kind.js";

export default {
  [Kind.File]: async path => {
    await rm(path);
  },
  [Kind.Directory]: async (path, { force, recursive } = {}) => {
    await rm(path, { force, recursive });
  },
  [Kind.Link]: async path => {
    new File(await realpath(path)).remove();
  },
};
