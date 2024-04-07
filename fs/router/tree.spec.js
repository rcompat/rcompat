import mktree from "./tree.js";

const r = (route, expected = route) => [route, {
  default: {
    get() {
      return expected;
    },
  },
}];

const routes = [
  r("index"),
  ["svelte/+layout", { default: _ => _, recursive: true }],
  r("svelte/post-add"),
  r("svelte/svelte"),
  ["svelte/test/+layout", { default: _ => _, recursive: true }],
  r("svelte/test/index", "svelte/test"),
  r("svelte-nodb"),
  r("svelte"),
  r("test"),
  r("tests"),
  r("undefined"),
  r("url"),
  r("vue"),
  r("webc"),
  r("ws"),
];

const tree = mktree(routes);
const match = assert => (route, expected) => {
  assert(tree.match(route).file.default.get()).equals(expected);
};

export default test => {
  test.case("tree", assert => {
    const matcher = match(assert);
    matcher("/", "index");
    matcher("/ws", "ws");
    matcher("/ws/", "ws");
    matcher("/svelte", "svelte");
    matcher("/svelte//", "svelte");
    matcher("/svelte-nodb", "svelte-nodb");
    matcher("/svelte/svelte", "svelte/svelte");
    matcher("/svelte/svelte/", "svelte/svelte");
    matcher("/svelte/test", "svelte/test");
    matcher("/svelte/test/", "svelte/test");
  });
};
