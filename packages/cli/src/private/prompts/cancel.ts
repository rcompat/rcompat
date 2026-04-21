import fg from "#fg";

const CANCEL = Symbol.for("@rcompat/cli/prompts.CANCEL");

export default function cancel(message?: string) {
  if (message) process.stdout.write(`${fg.yellow("↩")} ${message}\n`);
  return CANCEL;
};
