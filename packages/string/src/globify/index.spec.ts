import globify from "@rcompat/string/globify";
import test from "@rcompat/test";
import type Asserter from "@rcompat/test/Asserter";

const paths = [
  "a",
  "a.js",
  "a.css",
  "a_js",
  "a/b.js",
  "a/b.css",
  "a/b_css",
  "a/b/c.js",
  "a/b/c.css",
  "a/b/c_css",
  "b",
  "a/",
  "a/b/c/d/e.js",
  "/a",
  "c",
];

type AnyStringFunction = keyof { [K in keyof string as string[K] extends (arg: string) => unknown ? K : never]: true }

const is = (c: string, key: AnyStringFunction) => paths.flatMap((path, i) => path[key](c) ? [i] : []);
const includes = (c: string) => is(c, "includes");
const starts = (c: string) => is(c, "startsWith");
const ends = (c: string) => is(c, "endsWith");

const check = (assert: Asserter, glob: string, positions: number[]) => {
  const globbed = globify(glob);

  paths.map((path, i) =>
    assert(globbed.test(path)).equals(positions.includes(i)),
  );
};

test.case("simple", assert => {
  check(assert, "a", [0]);
  check(assert, "a.js", [1]);
  check(assert, "a.css", [2]);
});

test.case("question mark", assert => {
  check(assert, "?", [0,10,14]);
  check(assert, "??", [11,13]);
  check(assert, "a?js", [1,3]);
});

test.case("simple wildcard", assert => {
  check(assert, "*", [0,1,2,3,10,14]);
  check(assert, "a*", [0,1,2,3]);
  check(assert, "a.*", [1,2]);
});

test.case("double wildcard", assert => {
  check(assert, "**", paths.map((_, i) => i));
  check(assert, "**c**", includes("c"));
  check(assert, "/**/", starts("/"));
  check(assert, "/**", starts("/"));
  check(assert, "**/", ends("/"));
  check(assert, "a**", starts("a"));
  check(assert, "**.", []);
  check(assert, "**.js", ends(".js"));
  check(assert, "**.css", ends(".css"));
  check(assert, "**.*", [1, 2, 4, 5, 7, 8, 12]);
  check(assert, "**_*", [3, 6, 9]);
  check(assert, "**/*", includes("/"));
  check(assert, "/**/*", starts("/"));
  check(assert, "a/**/*.js", [4, 7, 12]);
});

test.case("brackets", assert => {
  check(assert, "[ab]", [0, 10]);
  check(assert, "[a-b]", [0, 10]);
  check(assert, "[a-c]", [0, 10, 14]);
});
