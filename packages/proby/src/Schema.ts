import p from "pema";

const Schema = p({
  monorepo: p.boolean.default(false),
  packages: p.string.default("packages"),
  include: p.array(p.string).default(["src"]),
  conditions: p.array(p.string).default(["source", "default"]),
});

export default Schema;
