import dim from "#color/dim";
import red from "#color/red";
import readline from "#prompts/readline";
import write from "#prompts/write";

type Option<T> = { label: string; value: T };
type Args<T> = { initial?: number; message: string; options: Array<Option<T>> };

export default async function select<T>(args: Args<T>): Promise<T> {
  const { initial = 0, message, options } = args;
  write(`${message}\n`);
  options.forEach((o, i) => write(`  ${i + 1}. ${o.label}\n`));
  for (; ;) {
    write(dim(`(1-${options.length})› `));
    const line = await readline();
    if (line === null) return options[initial]!.value;
    const idx = Number((line || "").trim()) - 1;
    if (Number.isInteger(idx) && idx >= 0 && idx < options.length) {
      return options[idx]!.value;
    }
    write(`${red("✖ Invalid choice")}\n`);
  }
}
