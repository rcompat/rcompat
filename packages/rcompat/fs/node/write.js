import { writeFile } from "node:fs/promises";

export default async (path, data) => {
  const buffer = data instanceof Blob ? data.stream() : data;
  return writeFile(path, buffer);
};
