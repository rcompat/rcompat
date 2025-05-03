type Not<T extends boolean> = T extends true ? false : true

export type { Not as default };
