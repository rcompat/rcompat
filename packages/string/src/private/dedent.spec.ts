import dedent from "#dedent";
import test from "@rcompat/test";

test.case("removes leading indentation", assert => {
  const result = dedent(`
    line 1
      line 2
    line 3
  `);

  assert(result).equals("line 1\n  line 2\nline 3");
});

test.case("works with template strings and values", assert => {
  const name = "world";
  const result = dedent`
    Hello, ${name}!
      This is indented.
  `;

  assert(result).equals("Hello, world!\n  This is indented.");
});

test.case("removes nothing if no common indent", assert => {
  const result = dedent("no indent\n  indented");
  assert(result).equals("no indent\n  indented");
});

test.case("trims leading and trailing empty lines", assert => {
  const result = dedent(`

    line

  `);
  assert(result).equals("line");
});
