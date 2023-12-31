import { cp, copyFile, realpath }from "node:fs/promises";
import Kind from "./Kind.js";
import FSFile from "./File.js";

export default {
  [Kind.File]: async (from, to) => {
    await copyFile(from, to);
  },
  [Kind.Directory]: async (from, to, filter) => {
    // copy all files
    await cp(from, to, {
      filter,
      recursive: true,
    });
  },
  [Kind.Link]: async (from, to) => {
    new FSFile(await realpath(from)).copy(to);
  },
};
