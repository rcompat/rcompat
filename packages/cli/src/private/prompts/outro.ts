import color from "#color";

export default function outro(message?: string) {
  if (message) process.stdout.write(`${color.green("✔")} ${message}\n`);
};
