import green from "#color/green";

export default (message?: string) => {
  if (message) process.stdout.write(`${green("✔")} ${message}\n`);
};
