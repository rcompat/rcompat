import color from "#color";
import readline from "#prompts/readline";
import write from "#prompts/write";

type Args = { initial?: boolean; message: string };
type Return = Promise<boolean | typeof CANCEL>;

const CANCEL = Symbol.for("@rcompat/cli/prompts.CANCEL");

export default async function confirm(args: Args): Return {
  const { initial, message } = args;
  const hint = initial === true ? "Y/n" : initial === false ? "y/N" : "y/n";
  const prompt = `${message} ${color.dim(`(${hint})`)} ${color.dim("› ")}`;

  for (; ;) {
    write(prompt);
    const line = await readline();

    // Ctrl+C / Ctrl+D → cancel (match text/select/multiselect semantics)
    if (line === null) return CANCEL;

    const s = line.trim().toLowerCase();
    if (s === "" && typeof initial === "boolean") return initial;
    if (s === "y" || s === "yes") return true;
    if (s === "n" || s === "no") return false;

    write(`${color.dim("Please answer y or n.")}\n`);
  }
};
