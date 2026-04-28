import fg from "#fg";
import CANCEL from "#prompts/symbol";

export default function cancel(message?: string) {
  if (message) process.stdout.write(`${fg.yellow("↩")} ${message}\n`);
  return CANCEL;
};
