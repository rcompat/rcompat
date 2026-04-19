import flags from "#flags";
import type Runtime from "#Runtime";
import dict from "@rcompat/dict";

const args: string[] = [];

const unimplemented = () => {
  throw new Error("unimplemented");
};

const browser: Runtime = dict.new({
  name: "browser",
  bin: "",
  script: "",
  cwd: unimplemented,
  args,
  os: undefined,
  arch: undefined,
  exit: unimplemented,
  resolve: unimplemented,
  toRequire: unimplemented,
  packageJSON: unimplemented,
  projectRoot: unimplemented,
  conditions: unimplemented,
  flags: flags(args),
});

export default browser;
