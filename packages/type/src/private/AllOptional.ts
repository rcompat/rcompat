type AllOptional<T> = {
  [K in keyof T]-?: undefined extends T[K] ? true : false;
}[keyof T] extends true ? true : false;

export type { AllOptional as default };
