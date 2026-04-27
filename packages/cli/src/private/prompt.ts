export type { default as CancelSymbol } from "#prompts/CancelSymbol";
export type { default as ConfirmOptions } from "#prompts/ConfirmOptions";
export type { default as SelectOption } from "#prompts/SelectOption";
export type { default as SelectOptions } from "#prompts/SelectOptions";
export type { default as TextOptions } from "#prompts/TextOptions";

import cancel from "#prompts/cancel";
import confirm from "#prompts/confirm";
import intro from "#prompts/intro";
import multiselect from "#prompts/multiselect";
import outro from "#prompts/outro";
import readline from "#prompts/readline";
import select from "#prompts/select";
import spinner from "#prompts/spinner";
import text from "#prompts/text";

const CANCEL = Symbol.for("@rcompat/cli/prompts.CANCEL");

function isCancel(v: unknown): v is typeof CANCEL {
  return v === CANCEL;
}
const prompt = {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  readLine: readline,
  select,
  spinner,
  text,
};

export { CANCEL };

export default prompt;
