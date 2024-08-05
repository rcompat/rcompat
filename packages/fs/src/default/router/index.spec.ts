import type { DebrisTestSuite } from "@rcompat/core";
import identity from "@rcompat/function/identity";
import Router from "@rcompat/fs/router";

const domain = "https://rcompat.dev";
const r = (route: any, expected = route) => [route, {
  default: {
    get() {
      return expected;
    },
    post() {
      return expected;
    }
  },
}];

const routes = [
  r("index"),
  ["svelte/+layout", { default: identity, recursive: true, name: "l0" }],
  ["svelte/+guard", { default: identity, name: "g0" }],
  ["svelte/+error", { default: identity, name: "e0" }],
  r("svelte/post-add"),
  r("svelte/svelte"),
  ["svelte/test/+layout", { default: identity, recursive: true, name: "l1" }],
  ["svelte/test/+guard", { default: identity, name: "g1" }],
  ["svelte/test/+error", { default: identity, name: "e1" }],
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
  ["[p1]/+layout", { default: identity, recursive: true, name: "p1l0" }],
  r("[p1]/[p2]", "p1/p2"),
  ["[p1]/[p2]/+layout", { default: identity, recursive: true, name: "p1p2l1" }],
  r("[p1]/[p2]/[p3]", "p1/p2/p3"),
  r("svelte/[p2]", "svelte/p2"),
  r("[p1]/svelte", "p1/svelte"),
  r("bool/[b1=boolean]", "b1"),
  r("opt/[[optional]]", "o1"),
  ["opt/+layout", { default: identity, recursive: true, name: "optl0" }],
  ["svelte/+guard", { default: identity, name: "g0" }],
  r("optp/[p1]/[[optional]]", "op1"),
  r("optn/[[opt=number]]", "optn"),
  r("rest/[...rest]", "rest"),
  ["rest/+layout", { default: identity, recursive: true, name: "restl0" }],
  r("restopt/[[...rest]]", "restopt"),
  ["restopt/+layout", { default: identity, recursive: true, name: "restoptl0" }],
  r("test/[test]/index", "testtestindex"),
  r("test/[test]/view", "testtestview"),
];

export default (test => {
  test.case("errors", assert => {
    const dbls = [
      // same dynamic
      [
        r("[p1]", "p1"),
        r("[p2]", "p2"),
      ],
      // static/same dynamic
      [
        r("s/[p1]", "s/p1"),
        r("s/[p2]", "s/p2"),
      ],
      // explicit/implicit index
      [
        r("htmx", "htmx"),
        r("htmx/index", "htmx"),
      ],
      // dynamic with/without type
      [
        r("[p1]", "p1"),
        r("[p1=number]", "p1=number"),
      ],
      // index and optional
      [
        r("htmx/[[opt]]", "htmx/[[opt]]"),
        r("htmx/index", "htmx"),
      ],
      // quasi-index and optional
      [
        r("htmx/[[opt]]", "htmx/[[opt]]"),
        r("htmx", "htmx"),
      ],
      // index and rest optional
      [
        r("htmx/[[...opt]]", "htmx/[[...restopt]]"),
        r("htmx/index", "htmx"),
      ],
      // quasi-index and rest optional
      [
        r("htmx/[[...opt]]", "htmx/[[...restopt]]"),
        r("htmx", "htmx"),
      ],
    ];
    dbls.forEach(dbl => {
      assert(() => Router.init({}, dbl as never)).throws("double route");
    });

    assert(() => Router.init({}, [
      r("s/[p1]", "s/p1") as never,
      r("[p1]/s", "p1/s") as never,
    ])).nthrows();

    assert(() => Router.init({}, [
      r("[[optional]]/1", "o/1") as never,
    ])).throws("optional routes must be leaves");

    assert(() => Router.init({}, [
      r("[[...optional_catch]]/1", "o/1") as never,
    ])).throws("optional routes must be leaves");

    assert(() => Router.init({}, [
      r("[...optional_catch]/1", "o/1") as never,
    ])).throws("rest routes must be leaves");
  });

  test.case("match", assert => {
    const router = Router.init({
      specials: {
        guard: { recursive: true },
        error: { recursive: false },
        layout: { recursive: true },
      },
      predicate(route, request) {
        return (route.default as never)[request.method.toLowerCase()] !== undefined;
      },
    }, routes as never);

    const match = (assert: any) => (path: any, route: any, expected_fn?: any) => {
      [path, `${path}/`].forEach(p => {
        const { file, ...rest } : any = router.match(new Request(`${domain}${p}`));
        assert(file.default.get()).equals(route);
        expected_fn?.(rest);
      });
    };
    const matcher = match(assert);
    const p = (expected: any) => ({ params } : { params: any }) => assert(params).equals(expected);
    const s = (special: any, undef?: any) => (i: any, expected?: any) => ({ specials } : { specials: any }) => {
      assert(specials[special]?.[i]?.name).equals(undef ? undefined : expected);
    };
    const l = s("layout");
    const g = s("guard");
    const e = s("error");
    const ne = s("error", true);
    const nl = s("layout", true);
    const $ = (...conditions: any) => (rest: any) =>
      conditions.forEach((condition: any) => condition(rest));
    matcher("/", "index");
    matcher("/ws", "ws");
    matcher("/svelte", "svelte");
    matcher("/svelte-nodb", "svelte-nodb");
    matcher("/svelte/svelte", "svelte/svelte");
    matcher("/svelte/test", "svelte/test",
      $(l(0, "l1"), l(1, "l0"), g(0, "g1"), g(1, "g0"), e(0, "e1"), (ne as any)(1)));
    matcher("/svelte/test2", "svelte/p2", p({ p2: "test2" }));
    matcher("/svelte/svelte", "svelte/svelte",
      $(l(0, "l0"), g(0, "g0"), e(0, "e0")));
    matcher("/svelte/post-add", "svelte/post-add", l(0, "l0"));
    matcher("/testsvelte/svelte", "p1/svelte", p({ p1: "testsvelte" }));
    matcher("/a", "p1", p({ p1: "a" }));
    matcher("/b", "p1", p({ p1: "b" }));
    matcher("/a/b", "p1/p2", $(p({ p1: "a", p2: "b" }/*, l(0, "p1l0")*/)));
    matcher("/b/a", "p1/p2", p({ p1: "b", p2: "a" }));
    matcher("/a/b/c", "p1/p2/p3", p({ p1: "a", p2: "b", p3: "c" }));
    matcher("/bool/true", "b1", p({ "b1=boolean": "true" }));
    matcher("/opt/o1", "o1", $(p({ optional: "o1" }), l(0, "optl0")));
    matcher("/opt", "o1", $(p({}), nl(0)));
    matcher("/optp/a/o1", "op1", p({ p1: "a", optional: "o1" }));
    matcher("/optp/a", "op1", p({ p1: "a" }));
    matcher("/optn/1", "optn", p({ "opt=number": "1" }));
    matcher("/rest/a", "rest", $(p({ rest: "a" }), l(0, "restl0")));
    matcher("/rest/a/b", "rest", $(p({ rest: "a/b" }/*, l(0, "restl0")*/)));
    matcher("/rest/a/b/c", "rest", $(p({ rest: "a/b/c" }), l(0, "restl0")));
    matcher("/restopt/a", "restopt", $(p({ rest: "a" }), l(0, "restoptl0")));
    matcher("/restopt/a/b", "restopt", $(p({ rest: "a/b" }), l(0, "restoptl0")));
    matcher("/restopt/a/b/c", "restopt", $(p({ rest: "a/b/c" }), l(0, "restoptl0")));
    matcher("/restopt", "restopt", $(p({}), nl(0)));
    matcher("/test/test", "testtestindex", p({ test: "test" }));
    matcher("/test/test/index", "testtestindex", p({ test: "test" }));
    matcher("/test/test2", "testtestindex", p({ test: "test2" }));
    matcher("/test/test2/index", "testtestindex", p({ test: "test2" }));
    matcher("/test/test/view", "testtestview", p({ test: "test" }));
    matcher("/test/test2/view", "testtestview", p({ test: "test2" }));
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
        return (route.default as any)[request.method.toLowerCase()] !== undefined;
      },
    }, routes as never);
    const match = (assert: any) => (request: any, route?: any, expected_fn?: any) => {
      [request].forEach(p => {
        const { file, ...rest } = router.match(p) ?? {};
        assert((file?.default.get as any)()).equals(route);
        expected_fn?.(rest);
      });
    };
    const matcher = match(assert);
    matcher(new Request(domain, { method: "GET" }), "index");
  });
}) satisfies DebrisTestSuite;
