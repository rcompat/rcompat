import { resolve as resolve_ } from "node:path";
import { is, maybe } from "@rcompat/invariant";
import { file, default as FlatFile, parse, type Path } from "./FlatFile.js";
import type * as Z from "./types.js";

export const webpath = (path: Path) => file(path).webpath();

export const join = (...[first, ...rest]: [Path, ...Path[]]) =>
  rest.length === 0 ? file(first) : file(first).join(...rest);
  
export const list = (path: Path, filter: Z.DirectoryFilter, options: {}) =>
  file(path).list(filter, options);

export const glob = (pattern: string) => file(".").glob(pattern);

export type CollectOptions = [Z.CollectPattern, Z.DirectoryOptions];
export const collect = (path: Path, ...args: CollectOptions) =>
  file(path).collect(...args);

export const exists = (path: Path) => file(path).exists();

export const directory = (path: Path) => file(path).directory;

export const arrayBuffer = (path: Path) => file(path).arrayBuffer();

export const text = (path: Path) => file(path).text();

export const json = (path: Path) => file(path).json();

export const copy = (from: Path, to: FlatFile, options?: Z.DirectoryFilter) =>
  file(from).copy(to, options);

export const create = (path: Path, options?: Z.DirectoryOptions) =>
  file(path).create(options);

export const remove =(path: Path, options?: Z.RemoveOptions) =>
  file(path).remove(options);

export const write = (path: Path, input: Z.WritableInput) =>
  file(path).write(input);

export const discover = (path: Path, filename: string) =>
  file(path).discover(filename);

export const stream = (path: Path) => file(path).stream();

export const resolve = (path?: string): FlatFile => {
  maybe(path).string();

  return file(path === undefined ? resolve_() : resolve_(parse(path)));
}

export const same = (left: FlatFile, right: FlatFile) => {
  is(left.path).string();
  is(right.path).string();

  return left.path === right.path;
  }
