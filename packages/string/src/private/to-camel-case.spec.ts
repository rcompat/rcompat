import toCamelCase from "#to-camel-case";
import test from "@rcompat/test";

test.case("uppercased -> unchanged", assert => {
  assert(toCamelCase("Hi")).equals("Hi");
  assert(toCamelCase("HI")).equals("Hi");
});

test.case("one part", assert => {
  assert(toCamelCase("hi")).equals("Hi");
});

test.case("many parts", assert => {
  assert(toCamelCase("hello-world")).equals("HelloWorld");
  assert(toCamelCase("Hello-worlD")).equals("HelloWorld");
  assert(toCamelCase("hello_world")).equals("HelloWorld");
  assert(toCamelCase("Hello_worlD")).equals("HelloWorld");
});
