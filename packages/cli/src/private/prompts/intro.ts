import bold from "#color/bold";

export default (message?: string) => {
  if (message) process.stdout.write(`${bold("●")} ${message}\n`);
};
