import type { FileRef } from "@rcompat/fs";

type Conf = {
  host: string;
  port: number;
  ssl?: {
    cert: FileRef;
    key: FileRef;
  };
  timeout?: number;
};

export type { Conf as default };
