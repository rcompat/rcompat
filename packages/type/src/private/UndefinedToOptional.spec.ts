import type UndefinedToOptional from "#UndefinedToOptional";
import test from "@rcompat/test";

test.case("pass", assert => {
  assert<UndefinedToOptional<{
    foo: string | undefined;
  }>>()
    .type<{ foo?: string }>()
    .type<{ foo?: string | undefined }>()
  ;

  assert<UndefinedToOptional<{
    foo: string | undefined;
    bar: number | undefined;
  }>>()
    .type<{ foo?: string; bar?: number }>()
    .type<{ foo?: string | undefined; bar?: number }>()
    .type<{ foo?: string; bar?: number | undefined }>()
    .type<{ foo?: string | undefined; bar?: number | undefined }>()
  ;

  assert<UndefinedToOptional<{
    foo: string | undefined;
    bar: number | undefined;
    baz?: boolean;
  }>>()
    .type<{ foo?: string; bar?: number; baz?: boolean }>()
    .type<{ foo?: string; bar?: number; baz?: boolean | undefined }>()
  ;
});

test.case("fail", assert => {
  assert<UndefinedToOptional<{ foo: string | undefined }>>()
    .nottype<{ foo: string | undefined }>();
});
