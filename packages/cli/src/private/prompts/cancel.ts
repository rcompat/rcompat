import color from "#color";

const CANCEL = Symbol.for("@rcompat/cli/prompts.CANCEL");

export default function cancel(message?: string) {
  if (message) process.stdout.write(`${color.yellow("↩")} ${message}\n`);
  return CANCEL;
};
