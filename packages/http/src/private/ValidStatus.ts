import type Status from "#Status";

type StatusType = typeof Status;

type ValidStatus = StatusType[keyof StatusType];

export type { ValidStatus as default };
