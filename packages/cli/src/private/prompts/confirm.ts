import dim from "#color/dim";
import write from "#prompts/write";
import readline from "@rcompat/stdio/readline";

type ConfirmOptions = { initial?: boolean; message: string };

export default async (opts: ConfirmOptions) => {
  const { initial, message } = opts;
  const hint = initial === true ? "Y/n" : initial === false ? "y/N" : "y/n";
  const prompt = `${message} ${dim(`(${hint})`)} ${dim("› ")}`;

  for (; ;) {
    write(prompt);
    const line = await readline();
    if (line === null) return Boolean(initial);
    const s = line.trim().toLowerCase();
    if (s === "" && typeof initial === "boolean") return initial;
    if (["y", "yes"].includes(s)) return true;
    if (["n", "no"].includes(s)) return false;
    write(`${dim("Please answer y or n.")}\n`);
  }
};
