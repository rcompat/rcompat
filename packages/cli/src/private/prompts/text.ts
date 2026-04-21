import fg from "#fg";
import readline from "#prompts/readline";
import type Args from "#prompts/TextOptions";
import write from "#prompts/write";
import is from "@rcompat/is";

const CANCEL = Symbol.for("@rcompat/cli/prompts.CANCEL");
type Return = Promise<string | typeof CANCEL>;

const render = (msg: string, initial?: string) => {
  const suffix = initial ? ` ${fg.dim(`(${initial})`)}` : "";
  return `${msg}${suffix} ${fg.dim("› ")}`;
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
        if (is.text(out)) {
          write(`${fg.red(`✖ ${out}`)}\n`);
          continue;
        }
      } catch (e) {
        const msg = is.error(e) ? e.message : String(e);
        write(`${fg.red(`✖ ${msg || "Invalid input"}`)}\n`);
        continue;
      }
    }

    return answer;
  }
};
