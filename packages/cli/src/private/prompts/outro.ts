import fg from "#fg";

export default function outro(message?: string) {
  if (message) process.stdout.write(`${fg.green("✔")} ${message}\n`);
};
