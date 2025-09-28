type TextOptions = {
  initial?: string;
  message: string;
  validate?: (input: string) => Promise<string | void> | string | void;
};

export type { TextOptions as default };
