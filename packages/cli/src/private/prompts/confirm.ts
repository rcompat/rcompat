import dim from "#color/dim";
import readline from "#prompts/readline";
import write from "#prompts/write";

type ConfirmOptions = { initial?: boolean; message: string };

const CANCEL = Symbol.for("@rcompat/cli.prompts.CANCEL");

export default async (opts: ConfirmOptions): Promise<boolean | typeof CANCEL> => {
  const { initial, message } = opts;
  const hint = initial === true ? "Y/n" : initial === false ? "y/N" : "y/n";
  const prompt = `${message} ${dim(`(${hint})`)} ${dim("› ")}`;

  for (; ;) {
    write(prompt);
    const line = await readline();

    // Ctrl+C / Ctrl+D → cancel (match text/select/multiselect semantics)
    if (line === null) return CANCEL;

    const s = line.trim().toLowerCase();
    if (s === "" && typeof initial === "boolean") return initial;
    if (s === "y" || s === "yes") return true;
    if (s === "n" || s === "no") return false;

    write(`${dim("Please answer y or n.")}\n`);
  }
};
