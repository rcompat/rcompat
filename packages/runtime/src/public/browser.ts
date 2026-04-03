import type Runtime from "#Runtime";

const browser: Runtime = {
  name: "browser",
  bin: "",
  script: "",
  args: [],
  exit: () => { throw ("unimplemented"); },
  resolve: () => { throw ("unimplemented"); },
};

export default browser;
