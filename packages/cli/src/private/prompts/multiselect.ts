import dim from "#color/dim";
import red from "#color/red";
import readline from "#prompts/readline";
import write from "#prompts/write";

type Option<T> = { label: string; value: T };
type Args<T> = {
  initial?: number[];
  message: string;
  options: Array<Option<T>>;
};

export default async function multiselect<T>(args: Args<T>): Promise<T[]> {
  const { message, options } = args;

  // normalize initial: in-range integers, preserve order, dedupe
  const normalized: number[] = [];
  const seen = new Set<number>();
  if (Array.isArray(args.initial)) {
    for (const i of args.initial) {
      if (Number.isInteger(i) && i >= 0 && i < options.length && !seen.has(i)) {
        seen.add(i);
        normalized.push(i);
      }
    }
  }

  write(`${message}\n`);
  options.forEach((o, i) => write(`  ${i + 1}. ${o.label}\n`));

  const hint = normalized.length
    ? normalized.map((i) => String(i + 1)).join(",")
    : "";

  for (; ;) {
    write(dim("Enter numbers, comma-separated › "));
    if (hint) write(dim(`(${hint}) `));

    const line = await readline();

    // EOF or empty input -> accept normalized defaults
    if (line === null || line.trim() === "") {
      return normalized.map((i) => options[i]!.value);
    }

    // parse user input to 0-based indices
    const raw = String(line)
      .split(",")
      .map((s) => Number(s.trim()) - 1)
      .filter((n) => Number.isInteger(n));

    // dedupe while preserving order and keep only valid indices
    const idxs: number[] = [];
    const used = new Set<number>();
    for (const n of raw) {
      if (n >= 0 && n < options.length && !used.has(n)) {
        used.add(n);
        idxs.push(n);
      }
    }

    if (idxs.length) return idxs.map((i) => options[i]!.value);

    write(`${red("✖ Choose at least one valid option")}\n`);
  }
}
