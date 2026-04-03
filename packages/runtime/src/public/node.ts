export default {
  name: "node",
  bin: process.execPath,
  script: process.argv[1],
  args: process.argv.slice(2),
  exit: (code?: number) => process.exit(code),
};
