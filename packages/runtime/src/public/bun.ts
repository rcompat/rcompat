export default {
  name: "bun",
  bin: Bun.argv[0],
  script: Bun.argv[1],
  args: Bun.argv.slice(2),
  exit: (code?: number) => process.exit(code),
};
