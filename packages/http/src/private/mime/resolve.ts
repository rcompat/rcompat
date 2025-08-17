import extensions from "#mime/extensions";

type Extension = keyof typeof extensions;

const isExtension = (extension: unknown): extension is Extension =>
  typeof extension === "string" && extension in extensions;

const regex = /\.(?<extension>[a-z0-9]+)$/i;

const DEFAULT_EXTENSION = extensions.bin;

const match = (filename: string) => filename.match(regex)?.groups?.extension;

export default function resolve(filename: string) {
  const matched = match(filename.toLowerCase());

  return isExtension(matched) ? extensions[matched] : DEFAULT_EXTENSION;
};
