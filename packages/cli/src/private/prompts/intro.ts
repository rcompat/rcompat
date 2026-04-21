import fg from "#fg";

export default function intro(message?: string) {
  if (message) process.stdout.write(`${fg.bold("●")} ${message}\n`);
};
