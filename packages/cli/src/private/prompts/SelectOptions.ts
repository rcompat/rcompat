import type SelectOption from "#prompts/SelectOption";

type SelectOptions<T> = {
  initial?: number;
  message: string;
  options: Array<SelectOption<T>>;
};

export type { SelectOptions as default };
