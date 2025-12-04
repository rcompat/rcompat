import type FileRef from "@rcompat/fs/FileRef";

export default interface Conf {
  host: string;
  port: number;
  ssl?: {
    cert: FileRef;
    key: FileRef;
  };
  timeout?: number;
}
