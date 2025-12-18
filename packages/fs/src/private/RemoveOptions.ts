import type DirectoryOptions from "#DirectoryOptions";

export default interface RemoveOptions extends DirectoryOptions {
  fail?: boolean;
  recursive?: boolean;
}
