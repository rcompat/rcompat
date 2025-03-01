import type { FileRef } from "@rcompat/fs/file";

export default interface Conf {
  host: string;
  port: number;
  ssl?: {
    key: FileRef;
    cert: FileRef;
  };
}
