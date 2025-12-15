import color from "#color";
import readline from "#prompts/readline";
import type Args from "#prompts/TextOptions";
import write from "#prompts/write";

const CANCEL = Symbol.for("@rcompat/cli/prompts.CANCEL");
type Return = Promise<string | typeof CANCEL>;

const render = (msg: string, initial?: string) => {
  const suffix = initial ? ` ${color.dim(`(${initial})`)}` : "";
  return `${msg}${suffix} ${color.dim("› ")}`;
};

export default async function text(args: Args): Return {
  const { initial, message, validate } = args;

  for (; ;) {
    write(render(message, initial));
    const line = await readline();

    // SIGINT / EOF -> CANCEL
    if (line === null) return CANCEL;

    const answer = line.trim() || initial || "";

    if (validate) {
      try {
        const out = await validate(answer);
        if (typeof out === "string" && out) {
          write(`${color.red(`✖ ${out}`)}\n`);
          continue;
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        write(`${color.red(`✖ ${msg || "Invalid input"}`)}\n`);
        continue;
      }
    }

    return answer;
  }
};
