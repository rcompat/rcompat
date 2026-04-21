import extensions from "#mime/extensions";

type Extension = keyof typeof extensions;

function is_extension(extension: unknown): extension is Extension {
  return typeof extension === "string" && extension in extensions;
}

const regex = /\.(?<extension>[a-z0-9]+)$/i;

const DEFAULT_EXTENSION = extensions.bin;

function match(filename: string) {
  return filename.match(regex)?.groups?.extension;
}

export default function resolve(filename: string) {
  const matched = match(filename.toLowerCase());

  return is_extension(matched) ? extensions[matched] : DEFAULT_EXTENSION;
};
