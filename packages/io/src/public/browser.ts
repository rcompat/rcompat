function unimplemented() {
  throw new Error("unimplemented");
}

const io = {
  async: {},
  isatty: unimplemented,
  run: unimplemented,
  spawn: unimplemented,
  stderr: {},
  stdin: {},
  stdout: {},
  which: unimplemented,
};

export default io;
