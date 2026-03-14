import parse from "#parse";
import test from "@rcompat/test";

test.case("empty string", assert => {
  assert(parse("")).equals({});
});

test.case("basic key=value", assert => {
  assert(parse("FOO=bar")).equals({ FOO: "bar" });
});

test.case("multiple keys", assert => {
  assert(parse("FOO=bar\nBAZ=qux")).equals({ FOO: "bar", BAZ: "qux" });
});

test.case("ignores comments", assert => {
  assert(parse("# this is a comment\nFOO=bar")).equals({ FOO: "bar" });
});

test.case("ignores blank lines", assert => {
  assert(parse("FOO=bar\n\nBAZ=qux")).equals({ FOO: "bar", BAZ: "qux" });
});

test.case("export prefix", assert => {
  assert(parse("export FOO=bar")).equals({ FOO: "bar" });
});

test.case("single quoted value", assert => {
  assert(parse("FOO='bar baz'")).equals({ FOO: "bar baz" });
});

test.case("double quoted value", assert => {
  assert(parse("FOO=\"bar baz\"")).equals({ FOO: "bar baz" });
});

test.case("trims unquoted value", assert => {
  assert(parse("FOO=  bar  ")).equals({ FOO: "bar" });
});

test.case("substitution bare", assert => {
  assert(parse("FOO=world\nBAR=hello$FOO")).equals({
    FOO: "world", BAR: "helloworld",
  });
});

test.case("substitution braces", assert => {
  assert(parse("FOO=world\nBAR=hello${FOO}")).equals({
    FOO: "world", BAR: "helloworld",
  });
});

test.case("substitution from env", assert => {
  assert(parse("BAR=hello$FOO", { FOO: "world" })).equals({
    BAR: "helloworld",
  });
});

test.case("substitution undefined is empty string", assert => {
  assert(parse("BAR=hello$MISSING")).equals({ BAR: "hello" });
});

test.case("escaped dollar sign", assert => {
  assert(parse("FOO=hello\\$BAR")).equals({ FOO: "hello$BAR" });
});

test.case("single quotes skip substitution", assert => {
  assert(parse("FOO=world\nBAR='hello$FOO'")).equals({
    FOO: "world", BAR: "hello$FOO",
  });
});

test.case("substitution uses earlier lines in same file", assert => {
  assert(parse("A=1\nB=$A\nC=$B")).equals({ A: "1", B: "1", C: "1" });
});

test.case("substitution with fallback", assert => {
  assert(parse("FOO=${BAR:-default}")).equals({ FOO: "default" });
});

test.case("substitution with fallback ignored when var exists", assert => {
  assert(parse("BAR=real\nFOO=${BAR:-default}")).equals({
    BAR: "real", FOO: "real",
  });
});
