import candidates from "#candidates";
import test from "@rcompat/test";

test.case("no name", assert => {
  assert(candidates()).equals([".env.local", ".env"]);
});

test.case("with name", assert => {
  assert(candidates("development")).equals([
    ".env.development.local",
    ".env.development",
    ".env.local",
    ".env",
  ]);
});

test.case("empty string", assert => {
  assert(candidates("")).equals([".env.local", ".env"]);
});
