import isatty from "@rcompat/stdio/isatty";

export default function spinner() {
  let active = false;
  let timer: NodeJS.Timer | null = null;
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  let msg = "";

  function tick() {
    if (!active) return;
    process.stdout.write(`\r${frames[i = (i + 1) % frames.length]} ${msg}`);
  }

  return {
    message(text: string) {
      msg = text;
    },
    start(text: string) {
      msg = text;
      active = true;
      if (isatty()) timer = setInterval(tick, 80);
      else process.stdout.write(`${text}...\n`);
    },
    stop(text?: string) {
      if (timer) clearInterval(timer);
      if (isatty()) process.stdout.write(`\r✔ ${text ?? msg}\n`);
      else process.stdout.write(`${text ?? msg}\n`);
      active = false;
    },
  };
}
