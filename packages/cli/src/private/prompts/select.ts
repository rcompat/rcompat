import color from "#color";
import readline from "#prompts/readline";
import write from "#prompts/write";

type Option<T> = { label: string; value: T };
type Args<T> = { initial?: number; message: string; options: Array<Option<T>> };

export default async function select<T>(args: Args<T>): Promise<T> {
  const { initial = 0, message, options } = args;
  write(`${message}\n`);
  options.forEach((o, i) => write(`  ${i + 1}. ${o.label}\n`));
  for (; ;) {
    write(color.dim(`(1-${options.length})› `));
    const line = await readline();
    if (line === null) return options[initial]!.value;
    const idx = Number((line || "").trim()) - 1;
    if (Number.isInteger(idx) && idx >= 0 && idx < options.length) {
      return options[idx]!.value;
    }
    write(`${color.red("✖ Invalid choice")}\n`);
  }
}
