import camelcased from "#camelcased";
import test from "@rcompat/test";

test.case("uppercased -> unchanged", assert => {
  assert(camelcased("Hi")).equals("Hi");
  assert(camelcased("HI")).equals("Hi");
});

test.case("one part", assert => {
  assert(camelcased("hi")).equals("Hi");
});

test.case("many parts", assert => {
  assert(camelcased("hello-world")).equals("HelloWorld");
  assert(camelcased("Hello-worlD")).equals("HelloWorld");
  assert(camelcased("hello_world")).equals("HelloWorld");
  assert(camelcased("Hello_worlD")).equals("HelloWorld");
});
