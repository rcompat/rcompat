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
    bar: number | undefined;
    foo: string | undefined;
  }>>()
    .type<{ bar?: number; foo?: string }>()
    .type<{ bar?: number; foo?: string | undefined }>()
    .type<{ bar?: number | undefined; foo?: string }>()
    .type<{ bar?: number | undefined; foo?: string | undefined }>()
  ;

  assert<UndefinedToOptional<{
    bar: number | undefined;
    baz?: boolean;
    foo: string | undefined;
  }>>()
    .type<{ bar?: number; baz?: boolean; foo?: string }>()
    .type<{ bar?: number; baz?: boolean | undefined; foo?: string }>()
  ;
});

test.case("fail", assert => {
  assert<UndefinedToOptional<{ foo: string | undefined }>>()
    .nottype<{ foo: string | undefined }>();
});
