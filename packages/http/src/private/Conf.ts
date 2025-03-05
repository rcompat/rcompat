import type FileRef from "@rcompat/fs/FileRef";

export default interface Conf {
  host: string;
  port: number;
  ssl?: {
    key: FileRef;
    cert: FileRef;
  };
}
