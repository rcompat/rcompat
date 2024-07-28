export type CollectPattern = string | RegExp;
export type WritableInput = string | Blob;
export type DirectoryFilter = (path: string) => boolean;

export interface DirectoryOptions {
  recursive?: boolean;
}
export interface RemoveOptions extends DirectoryOptions {
  fail?: boolean;
}
