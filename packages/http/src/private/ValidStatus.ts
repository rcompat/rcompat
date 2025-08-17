import type Status from "#Status";

type StatusType = typeof Status;

type Known = StatusType[keyof StatusType];

export type { Known as default };
