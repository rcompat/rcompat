import { FlatFile } from "@rcompat/fs";

export default interface Conf {
  host: string;
  port: number;
  ssl?: {
    key: FlatFile;
    cert: FlatFile;
  };
}
