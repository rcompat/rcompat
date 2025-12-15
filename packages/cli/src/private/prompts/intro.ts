import color from "#color";

export default function intro(message?: string) {
  if (message) process.stdout.write(`${color.bold("●")} ${message}\n`);
};
