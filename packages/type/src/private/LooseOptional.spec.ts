import type LooseOptional from "#LooseOptional";
import test from "@rcompat/test";

test.case("pass", assert => {
  assert<LooseOptional<{ foo: string | undefined }>>()
    .type<{ foo?: string | undefined }>();

  assert<LooseOptional<{ bar: number | undefined; foo: string | undefined }>>()
    .type<{ bar?: number | undefined; foo?: string | undefined }>();
});

test.case("explicit undefined accepted", assert => {
  // unlike UndefinedToOptional, explicit undefined is assignable
  //assert<LooseOptional<{ foo: string | undefined }>>()
  // .nottype<{ foo?: string }>();
});
