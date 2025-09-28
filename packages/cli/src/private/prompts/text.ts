import dim from "#color/dim";
import red from "#color/red";
import type TextOptions from "#prompts/TextOptions";
import write from "#prompts/write";
import readline from "@rcompat/stdio/readline";

const render = (msg: string, initial?: string) => {
  const suffix = initial ? ` ${dim(`(${initial})`)}` : "";
  return `${msg}${suffix} ${dim("› ")}`;
};

export default async (opts: TextOptions) => {
  const { initial, message, validate } = opts;

  // loop until valid (or EOF)
  for (; ;) {
    write(render(message, initial));
    const line = await readline();
    if (line === null) return ""; // EOF -> empty
    const ans = (line.trim() || initial || "");
    if (validate) {
      const out = await validate(ans);
      if (typeof out === "string" && out) {
        write(`${red(`✖ ${out}`)}\n`);
        continue;
      }
    }
    return ans;
  }
};
