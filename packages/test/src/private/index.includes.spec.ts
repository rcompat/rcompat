import test from "#index";

test.case("includes: string contains substring", assert => {
  assert("hello world").includes("world");
});

test.case("includes: string does not contain substring", assert => {
  assert("hello world").not.includes("foo");
});

test.case("includes: array contains element", assert => {
  assert([1, 2, 3]).includes(2);
});

test.case("includes: array does not contain element", assert => {
  assert([1, 2, 3]).not.includes(4);
});

test.case("includes: empty string in string", assert => {
  assert("hello").includes("");
});

test.case("includes: empty array does not contain element", assert => {
  assert([]).not.includes(1);
});
