import fs from "node:fs";
import { Readable } from "node:stream";

const options = { flags: "r" };

export default (path: string) => 
  Readable.toWeb(fs.createReadStream(path, options));
