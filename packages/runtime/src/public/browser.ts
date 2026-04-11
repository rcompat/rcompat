import flags from "#flags";
import type Runtime from "#Runtime";
import dict from "@rcompat/dict";

const args: string[] = [];

const browser: Runtime = dict.new({
  name: "browser",
  bin: "",
  script: "",
  args,
  exit: () => { throw ("unimplemented"); },
  resolve: () => { throw ("unimplemented"); },
  packageJSON: () => { throw ("unimplemented"); },
  projectRoot: () => { throw ("unimplemented"); },
  flags: flags(args),
});

export default browser;
