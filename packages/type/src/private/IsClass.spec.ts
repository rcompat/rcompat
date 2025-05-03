import type IsClass from "#IsClass";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsClass<Date>>().type<true>();
  assert<IsClass<Blob>>().type<true>();
  assert<IsClass<File>>().type<true>();
  assert<IsClass<URL>>().type<true>();
  assert<IsClass<Boolean>>().type<true>();
  assert<IsClass<String>>().type<true>();
  assert<IsClass<Number>>().type<true>();
  assert<IsClass<BigInt>>().type<true>();
  assert<IsClass<Symbol>>().type<true>();
  assert<IsClass<Object>>().type<true>();
  assert<IsClass<Function>>().type<true>();
  assert<IsClass<ReadableStream>>().type<true>();
  assert<IsClass<WritableStream>>().type<true>();
  assert<IsClass<FormData>>().type<true>();
  assert<IsClass<{}>>().type<true>();

  class Test {};
  assert<IsClass<Test>>().type<true>();
});

test.case("false", assert => {
  assert<IsClass<any>>().type<false>();
  assert<IsClass<{} & any>>().type<false>();
  assert<IsClass<unknown>>().type<false>();
  assert<IsClass<never>>().type<false>();
  assert<IsClass<string>>().type<false>();
  assert<IsClass<"foo">>().type<false>();
  assert<IsClass<number>>().type<false>();
  assert<IsClass<0>>().type<false>();
  assert<IsClass<true>>().type<false>();
  assert<IsClass<null>>().type<false>();
  assert<IsClass<false>>().type<false>();
  assert<IsClass<Math>>().type<false>();
  assert<IsClass<JSON>>().type<false>();
  assert<IsClass<Atomics>>().type<false>();
});
