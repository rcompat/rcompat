import extensions from "#mime/extensions";
import dict from "@rcompat/dict";
import is from "@rcompat/is";

const regex = /\.(?<extension>[a-z0-9]+)$/i;

const DEFAULT_EXTENSION = extensions.bin;

function match(filename: string) {
  return filename.match(regex)?.groups?.extension;
}

export default function resolve(filename: string) {
  const found = match(filename.toLowerCase());
  if (is.undefined(found)) return DEFAULT_EXTENSION;

  return dict.has(extensions, found) ? extensions[found] : DEFAULT_EXTENSION;
};
