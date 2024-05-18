import globify from "./globify.js";

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

const is = (c: any, key: any) => paths.flatMap((path, i) => (path[key] as any)(c) ? [i] : []);
const includes = (c: any) => is(c, "includes");
const starts = (c: any) => is(c, "startsWith");
const ends = (c: any) => is(c, "endsWith");

export default (test => {
  test.reassert(assert => {
    const check = (glob: unknown, positions: number[]) => {
      const globbed = globify(glob);

      paths.map((path, i) =>
        assert(globbed.test(path)).equals(positions.includes(i)),
      );
    };
    return check;
  });
  test.case("simple", check => {
    check("a", [0]);
    check("a.js", [1]);
    check("a.css", [2]);
  });
  test.case("question mark", check => {
    check("?", [0,10,14]);
    check("??", [11,13]);
    check("a?js", [1,3]);
  });
  test.case("simple wildcard", check => {
    check("*", [0,1,2,3,10,14]);
    check("a*", [0,1,2,3]);
    check("a.*", [1,2]);
  });
  test.case("double wildcard", check => {
    check("**", paths.map((_, i) => i));
    check("**c**", includes("c"));
    check("/**/", starts("/"));
    check("/**", starts("/"));
    check("**/", ends("/"));
    check("a**", starts("a"));
    check("**.", []);
    check("**.js", ends(".js"));
    check("**.css", ends(".css"));
    check("**.*", [1, 2, 4, 5, 7, 8, 12]);
    check("**_*", [3, 6, 9]);
    check("**/*", includes("/"));
    check("/**/*", starts("/"));
    check("a/**/*.js", [4, 7, 12]);
  });
  test.case("brackets", check => {
    check("[ab]", [0, 10]);
    check("[a-b]", [0, 10]);
    check("[a-c]", [0, 10, 14]);
  });
}) satisfies DebrisTestSuite;
