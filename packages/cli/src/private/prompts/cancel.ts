import yellow from "#color/yellow";

const CANCEL = Symbol.for("@rcompat/cli.prompts.CANCEL");

export default (message?: string) => {
  if (message) process.stdout.write(`${yellow("↩")} ${message}\n`);
  return CANCEL;
};
