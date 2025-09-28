import dim from "#color/dim";
import red from "#color/red";
import type TextOptions from "#prompts/TextOptions";
import write from "#prompts/write";
import readline from "@rcompat/stdio/readline";

const CANCEL = Symbol.for("@rcompat/cli.prompts.CANCEL");

const render = (msg: string, initial?: string) => {
  const suffix = initial ? ` ${dim(`(${initial})`)}` : "";
  return `${msg}${suffix} ${dim("› ")}`;
};

export default async (opts: TextOptions): Promise<string | typeof CANCEL> => {
  const { initial, message, validate } = opts;

  for (; ;) {
    write(render(message, initial));
    const line = await readline();

    // SIGINT / EOF -> CANCEL
    if (line === null) return CANCEL;

    const answer = line.trim() || initial || "";

    if (validate) {
      const out = await validate(answer);
      if (typeof out === "string" && out) {
        write(`${red(`✖ ${out}`)}\n`);
        continue;
      }
    }

    return answer;
  }
};
