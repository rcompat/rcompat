import type Runtime from "#Runtime";

const browser: Runtime = {
  name: "browser",
  bin: "",
  script: "",
  args: [],
  exit: () => { throw ("unimplemented"); },
  resolve: () => { throw ("unimplemented"); },
  packageJSON: () => { throw ("unimplemented"); },
  projectRoot: () => { throw ("unimplemented"); },
};

export default browser;
