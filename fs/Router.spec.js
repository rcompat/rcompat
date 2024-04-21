import Router from "./Router.js";

const domain = "https://rcompat.dev";
const r = (route, expected = route) => [route, {
  default: {
    get() {
      return expected;
    },
  },
}];

const routes = [
  r("index"),
  ["svelte/+layout", { default: _ => _, recursive: true, name: "l0" }],
  ["svelte/+guard", { default: _ => _, name: "g0" }],
  ["svelte/+error", { default: _ => _, name: "e0" }],
  r("svelte/post-add"),
  r("svelte/svelte"),
  ["svelte/test/+layout", { default: _ => _, recursive: true, name: "l1" }],
  ["svelte/test/+guard", { default: _ => _, name: "g1" }],
  ["svelte/test/+error", { default: _ => _, name: "e1" }],
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
  r("[p1]", "p1"),
  ["[p1]/+layout", { default: _ => _, recursive: true, name: "p1l0" }],
  r("[p1]/[p2]", "p1/p2"),
  ["[p1]/[p2]/+layout", { default: _ => _, recursive: true, name: "p1p2l1" }],
  r("[p1]/[p2]/[p3]", "p1/p2/p3"),
  r("svelte/[p2]", "svelte/p2"),
  r("[p1]/svelte", "p1/svelte"),
  r("bool/[b1=boolean]", "b1"),
  r("opt/[[optional]]", "o1"),
  ["opt/+layout", { default: _ => _, recursive: true, name: "optl0" }],
  ["svelte/+guard", { default: _ => _, name: "g0" }],
  r("optp/[p1]/[[optional]]", "op1"),
  r("optn/[[opt=number]]", "optn"),
  r("rest/[...rest]", "rest"),
  ["rest/+layout", { default: _ => _, recursive: true, name: "restl0" }],
  r("restopt/[[...rest]]", "restopt"),
  ["restopt/+layout", { default: _ => _, recursive: true, name: "restoptl0" }],
];

export default test => {
  test.case("errors", assert => {
    const r1 = [
      r("[p1]", "p1"),
      r("[p2]", "p2"),
    ];
    assert(() => Router.init({}, r1)).throws("double route");
    const r2a = [
      r("s/[p1]", "s/p1"),
      r("s/[p2]", "s/p2"),
    ];
    assert(() => Router.init({}, r2a)).throws("double route");
    const r2b = [
      r("htmx", "htmx"),
      r("htmx/index", "htmx"),
    ];
    assert(() => Router.init({}, r2b)).throws("double route");
    const r3 = [
      r("[p1]", "p1"),
      r("[p1=number]", "p1=number"),
    ];
    assert(() => Router.init({}, r3)).throws("double route");
    const r4 = [
      r("s/[p1]", "s/p1"),
      r("[p1]/s", "p1/s"),
    ];
    assert(() => Router.init({}, r4)).nthrows();
    const r5 = [
      r("[[optional]]/1", "o/1"),
    ];
    assert(() => Router.init({}, r5)).throws("optional routes must be leaves");
    const r6 = [
      r("[[...optional_catch]]/1", "o/1"),
    ];
    assert(() => Router.init({}, r6)).throws("optional routes must be leaves");
    const r7 = [
      r("[...optional_catch]/1", "o/1"),
    ];
    assert(() => Router.init({}, r7)).throws("rest routes must be leaves");
  });

  test.case("match", assert => {
    const router = Router.init({
      specials: {
        guard: { recursive: true },
        error: { recursive: false },
        layout: { recursive: true },
      },
      predicate(route, request) {
        return route.default[request.method.toLowerCase()] !== undefined;
      },
    }, routes);

    const match = assert => (path, route, expected_fn) => {
      [path, `${path}/`].forEach(p => {
        const { file, ...rest } = router.match(new Request(`${domain}${p}`));
        assert(file.default.get()).equals(route);
        expected_fn?.(rest);
      });
    };
    const matcher = match(assert);
    const p = expected => ({ params }) => assert(params).equals(expected);
    const s = (special, undef) => (i, expected) => ({ specials }) => {
      assert(specials[special]?.[i]?.name).equals(undef ? undefined : expected);
    };
    const l = s("layout");
    const g = s("guard");
    const e = s("error");
    const ne = s("error", true);
    const nl = s("layout", true);
    const $ = (...conditions) => rest =>
      conditions.forEach(condition => condition(rest));
    matcher("/", "index");
    matcher("/ws", "ws");
    matcher("/svelte", "svelte");
    matcher("/svelte-nodb", "svelte-nodb");
    matcher("/svelte/svelte", "svelte/svelte");
    matcher("/svelte/test", "svelte/test",
      $(l(0, "l1"), l(1, "l0"), g(0, "g1"), g(1, "g0"), e(0, "e1"), ne(1)));
    matcher("/svelte/test2", "svelte/p2", p({ p2: "test2" }));
    matcher("/svelte/svelte", "svelte/svelte",
      $(l(0, "l0"), g(0, "g0"), e(0, "e0")));
    matcher("/svelte/post-add", "svelte/post-add", l(0, "l0"));
    matcher("/test/svelte", "p1/svelte", p({ p1: "test" }));
    matcher("/a", "p1", p({ p1: "a" }));
    matcher("/b", "p1", p({ p1: "b" }));
    matcher("/a/b", "p1/p2", $(p({ p1: "a", p2: "b" }, l(0, "p1l0"))));
    matcher("/b/a", "p1/p2", p({ p1: "b", p2: "a" }));
    matcher("/a/b/c", "p1/p2/p3", p({ p1: "a", p2: "b", p3: "c" }));
    matcher("/bool/true", "b1", p({ "b1=boolean": "true" }));
    matcher("/opt/o1", "o1", $(p({ optional: "o1" }), l(0, "optl0")));
    matcher("/opt", "o1", $(p({}), nl(0)));
    matcher("/optp/a/o1", "op1", p({ p1: "a", optional: "o1" }));
    matcher("/optp/a", "op1", p({ p1: "a" }));
    matcher("/optn/1", "optn", p({ "opt=number": "1" }));
    matcher("/rest/a", "rest", $(p({ rest: "a" }), l(0, "restl0")));
    matcher("/rest/a/b", "rest", $(p({ rest: "a/b" }, l(0, "restl0"))));
    matcher("/rest/a/b/c", "rest", $(p({ rest: "a/b/c" }), l(0, "restl0")));
    matcher("/restopt/a", "restopt", $(p({ rest: "a" }), l(0, "restoptl0")));
    matcher("/restopt/a/b", "restopt", $(p({ rest: "a/b" }), l(0, "restoptl0")));
    matcher("/restopt/a/b/c", "restopt", $(p({ rest: "a/b/c" }), l(0, "restoptl0")));
    matcher("/restopt", "restopt", $(p({}), nl(0)));
  });

  test.case("match with predicate", assert => {
    const routes = [
      r("index"),
    ];
    const router = Router.init({
      specials: {
        guard: {
          recursive: true,
        },
        error: {
          recursive: false,
        },
        layout: {
          recursive: true,
        },
      },
      predicate(route, request) {
        return route.default[request.method.toLowerCase()] !== undefined;
      },
    }, routes);
    const match = assert => (request, route, expected_fn) => {
      [request].forEach(p => {
        const { file, ...rest } = router.match(p) ?? {};
        assert(file?.default.get()).equals(route);
        expected_fn?.(rest);
      });
    };
    const matcher = match(assert);
    matcher(new Request(domain, { method: "GET" }), "index");
    matcher(new Request(domain, { method: "POST" }));
    matcher(new Request(`${domain}/test`, { method: "GET" }));
  });
};
