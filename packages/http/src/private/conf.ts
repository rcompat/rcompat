import FileRef from "@rcompat/fs/#/file-ref";

export default interface Conf {
  host: string;
  port: number;
  ssl?: {
    key: FileRef;
    cert: FileRef;
  };
}
