import FileRouter from "#FileRouter";
import { Code } from "#router/errors";
import type MatchedRoute from "#router/MatchedRoute";
import type { Asserter } from "@rcompat/test";
import test from "@rcompat/test";

class Expect {
  #m?: MatchedRoute;
  #assert: Asserter;
  #passed: boolean = false;

  constructor(assert: Asserter, m?: MatchedRoute) {
    this.#assert = assert;
    this.#m = m;
  }

  get #ok(): MatchedRoute {
    if (!this.#passed) {
      this.#assert(!!this.#m).true();
      this.#passed = true;
    }
    return this.#m!;
  }

  path(expected: string) {
    this.#assert(this.#ok!.path).equals(expected);
    return this;
  }

  param(name: string, expected: unknown) {
    this.#assert(this.#ok!.params[name]).equals(expected);
    return this;
  }

  params(expected: Dict<string>) {
    this.#assert(this.#ok!.params).equals(expected);
    return this;
  }

  layout(expected: string[]) {
    this.special("layout", expected);
    return this;
  }

  error(expected: string[]) {
    this.special("error", expected);
    return this;
  }

  guard(expected: string[]) {
    this.special("guard", expected);
    return this;
  }

  special(name: string, expected: string[]) {
    this.#assert(this.#ok!.specials[name]).equals(expected);
  }

  specials(expected: Dict<string[]>) {
    this.#assert(this.#ok!.specials).equals(expected);
  }

  fail() {
    this.#assert(this.#m).undefined();
  }
}

function init(assert: Asserter, objects: string[]) {
  const router = FileRouter.init({
    extensions: [".ts"],
    specials: {
      error: { recursive: false },
      guard: { recursive: true },
      layout: { recursive: true },
    },
  }, objects);

  return {
    depth(special: string) {
      return router.depth(special);
    },
    expect(pathname: string) {
      if (!pathname.startsWith("/")) {
        throw new Error(`pathname must start with '/', got '${pathname}'`);
      }
      return new Expect(assert, router.match(request(pathname))!);
    },
    match: router.match.bind(router),
  };
}

function request(path: string) {
  return new Request(`http://test${path}`);
}

test.group("match", () => {
  test.case("no match on empty", assert => {
    const router = init(assert, []);
    router.expect("/").fail();
  });
});

test.group("static", () => {
  test.case("normalize (slashes, explicit index)", assert => {
    const router = init(assert, ["static"]);
    const router2 = init(assert, ["static/index"]);
    [
      "/static",
      "/static",
      "//static",
      "/static/",
      "//static/",
      "/static//",
      "//static//",
      "/static/index",
      "/static/index/",
      "/static//index",
      "//static//index//",
      "//static//index///",
    ].forEach(pathname => {
      router.expect(pathname).path("static");
      router2.expect(pathname).path("static/index");
    });
    router.expect("//static//index//index").fail();
    router2.expect("//static//index//index").fail();
  });

  test.case("normalize index", assert => {
    const router = init(assert, ["index"]);
    ["/", "//", "///", "/index", "/index/", "//index//"].forEach(pathname => {
      router.expect(pathname).path("index");
    });
  });

  test.case("literal interim index route", assert => {
    const router = init(assert, ["static/index/index"]);
    router.expect("/static/index/index").path("static/index/index");
    router.expect("//static//index//index").path("static/index/index");
    router.expect("/static").fail();
    router.expect("/static/index").fail();
    router.expect("/static/index/index/index").fail();
  });

  test.case("deep path normalization", assert => {
    const router = init(assert, ["a/b/c"]);
    ["/a/b/c", "//a//b//c", "/a/b/c/", "/a/b/c/index"].forEach(pathname => {
      router.expect(pathname).path("a/b/c");
    });
  });

  test.case("encoded `/` (%2F) does not match", assert => {
    const router = init(assert, ["user/profile"]);
    router.expect("/%2F").fail();
    router.expect("/user/profile").path("user/profile");
    router.expect("//user/profile").path("user/profile");
    router.expect("/%2Fuser/profile").fail();
    router.expect("/user%2Fprofile").fail();
    router.expect("/user/profile%2F").fail();
  });

  test.case("override dynamic sibling", assert => {
    const router = init(assert, ["profile", "[id]"]);
    router.expect("/profile").path("profile");
    router.expect("/john").path("[id]").param("id", "john");

    const router2 = init(assert, ["user/profile", "user/[id]"]);
    router2.expect("/user/profile").params({});
    router2.expect("/user/john").param("id", "john");
  });

  test.case("with dynamic child", assert => {
    const router = init(assert, ["user", "user/[id]"]);
    router.expect("/user").path("user");
    router.expect("/user/42").path("user/[id]").param("id", "42");
  });

  test.case("with optional sibling", assert => {
    const router = init(assert, ["user/profile", "user/[id]"]);
    router.expect("/user/profile").path("user/profile");
    router.expect("/user/42").path("user/[id]").param("id", "42");
    router.expect("/user/index").fail();
  });

  test.case("throw with and without index", assert => {
    assert(() => init(assert, ["user", "user/index"])).throws(Code.double_route);
  });

  test.case("index vs index/index conflict", assert => {
    assert(() => init(assert, ["static/index", "static/index/index"])).throws(Code.double_route);
  });

  test.case("throw with optional child", assert => {
    assert(() => init(assert, ["user", "user/[[id]]"])).throws(Code.double_route);
    assert(() => init(assert, ["user/index", "user/[[id]]"])).throws(Code.double_route);
  });

  test.case("throw with optional rest child", assert => {
    assert(() => init(assert, ["user", "user/[[...id]]"])).throws(Code.double_route);
    assert(() => init(assert, ["user/index", "user/[[...id]]"])).throws(Code.double_route);
  });

  test.case("throw on directory file and index", assert => {
    assert(() => init(assert, ["directory", "directory/index"])).throws(Code.double_route);
  });
});

test.group("dynamic", () => {
  test.case("single-segment param decoding", assert => {
    const router = init(assert, ["user/[name]"]);
    router.expect("/user/%2Fhello%20%2Fworld")
      .path("user/[name]")
      .param("name", "/hello /world");
  });

  test.case("invalid encodings are preserved", assert => {
    const router = init(assert, ["user/[name]"]);
    router.expect("/user/%E0%A4%A").path("user/[name]").param("name", "%E0%A4%A");
  });

  test.case("directory", assert => {
    const router = init(assert, [
      "dd/index",
      "dd/test",
      "dd/[id]/index",
      "dd/[id]/test",
    ]);
    router.expect("/dd").path("dd/index");
    router.expect("/dd/test").path("dd/test");
    router.expect("/dd/1").path("dd/[id]/index").param("id", "1");
    router.expect("/dd/1/index").path("dd/[id]/index").param("id", "1");
    router.expect("/dd/1/test").path("dd/[id]/test").param("id", "1");
    router.expect("/dd/1/test2").fail();
  });

  test.case("with dynamic child", assert => {
    const path = "user/[id]/profile/[pid]";
    const router = init(assert, [path]);
    router.expect("/user").fail();
    router.expect("/user/profile").fail();
    router.expect("/user/1/profile").fail();
    router.expect("/user/1/profile/2/settings").fail();
    router.expect("/user/1/profile/2").path(path).params({ id: "1", pid: "2" });
  });

  test.case("with optional child", assert => {
    const path = "user/[id]/profile/[[pid]]";
    const router = init(assert, [path]);
    router.expect("/user").fail();
    router.expect("/user/profile").fail();
    router.expect("/user/1/profile/2/settings").fail();
    router.expect("/user/1/profile").path(path).params({ id: "1" });
    router.expect("/user/1/profile/2").path(path).params({ id: "1", pid: "2" });
  });

  test.case("with optional rest child", assert => {
    const path = "user/[id]/profile/[[...p]]";
    const router = init(assert, [path]);
    router.expect("/user").fail();
    router.expect("/user/profile").fail();
    router.expect("/user/1/profile").path(path).params({ id: "1" });
    router.expect("/user/1/profile/2").path(path).params({ id: "1", p: "2" });
    router.expect("/user/1/profile/2/settings").path(path)
      .params({ id: "1", p: "2/settings" });
  });

  test.case("no double params", assert => {
    assert(() => init(assert, ["user/[id]/profile/[id]"])).throws(Code.double_param);
    assert(() => init(assert, ["user/[id]/profile/[[id]]"])).throws(Code.double_param);
    assert(() => init(assert, ["user/[id]/profile/[[...id]]"])).throws(Code.double_param);
  });

  test.case("only one per segment", assert => {
    assert(() => init(assert, ["user/[id]", "user/[pid]"])).throws(Code.double_route);
    assert(() => init(assert, ["user/[id]", "user/[[pid]]"])).throws(Code.double_route);
    assert(() => init(assert, ["user/[id]", "user/[...rest]"])).throws(Code.double_route);
    assert(() => init(assert, ["user/[id]", "user/[[...rest]]"])).throws(Code.double_route);
  });
});

test.group("rest", () => {
  test.case("must be final segment", assert => {
    assert(() => init(assert, ["files/[...path]/extra"])).throws(Code.rest_route);
  });

  test.case("multi-segment capture and decoding", assert => {
    const router = init(assert, ["files/[...path]"]);
    router.expect("/files/a/b/c").path("files/[...path]").param("path", "a/b/c");
    router.expect("/files/a%20b%2Fc%20d").path("files/[...path]")
      .param("path", "a b/c d");
    router.expect("/files").fail();
  });

  test.case("invalid encodings preserved", assert => {
    const router = init(assert, ["f/[...p]"]);
    router.expect("/f/%E0%A4%A/%E0%A4%A")
      .path("f/[...p]")
      .param("p", "%E0%A4%A/%E0%A4%A");
  });
});

test.group("optional", () => {
  test.case("non-root directory", assert => {
    const router = init(assert, ["index", "optional/[[id]]"]);
    router.expect("/optional").path("optional/[[id]]").param("id", undefined);
    router.expect("/optional/john").path("optional/[[id]]").param("id", "john");
  });

  test.case("root directory", assert => {
    const router = init(assert, ["[[who]]"]);
    router.expect("/").path("[[who]]").param("who", undefined);
    router.expect("/john").path("[[who]]").param("who", "john");
    router.expect("/john/adams").fail();
  });

  test.case("must be final segment", assert => {
    assert(() => init(assert, ["opt/[[id]]/extra"])).throws(Code.optional_route);
  });

  test.case("throw with dynamic child", assert => {
    assert(() => init(assert, ["user/[[id]]/profile/[pid]"])).throws(Code.optional_route);
  });
});

test.group("optional rest", () => {
  test.case("non-root directory", assert => {
    const router = init(assert, ["files/[[...file]]"]);
    router.expect("/files").path("files/[[...file]]").param("file", undefined);
    router.expect("/files/1").path("files/[[...file]]").param("file", "1");
    router.expect("/files/data.bin").path("files/[[...file]]")
      .param("file", "data.bin");
    router.expect("/files/data/bin").path("files/[[...file]]")
      .param("file", "data/bin");
  });

  test.case("root directory", assert => {
    const router = init(assert, ["[[...rest]]"]);
    router.expect("/").path("[[...rest]]").param("rest", undefined);
    router.expect("/a/b").path("[[...rest]]").param("rest", "a/b");
    router.expect("/data.bin").path("[[...rest]]").param("rest", "data.bin");
    router.expect("/data/bin").path("[[...rest]]").param("rest", "data/bin");
  });
});

test.group("special", () => {
  test.case("does not match as a route path", assert => {
    const router = init(assert, ["index", "+layout"]);
    router.expect("/+layout").fail();
    router.expect("/").path("index").layout(["+layout"]);
  });

  test.case("local recursive special collected", assert => {
    const router = init(assert, ["index", "user/+layout", "user/profile"]);
    router.expect("/user/profile").path("user/profile").layout(["user/+layout"]);
  });

  test.case("local non-recursive special collected", assert => {
    const router = init(assert, ["index", "user/+error", "user/profile"]);
    router.expect("/user/profile").path("user/profile").error(["user/+error"]);
  });

  test.case("nested recursive specials compose from within", assert => {
    const router = init(assert, [
      "index",
      "+layout",
      "user/+layout",
      "user/profile",
    ]);
    router.expect("/user/profile").path("user/profile")
      .specials({ layout: ["user/+layout", "+layout"] });
  });

  test.case("nested non-recursive special only nearest", assert => {
    const router = init(assert, [
      "index",
      "+error",
      "user/+error",
      "user/profile",
    ]);
    router.expect("/").path("index").special("error", ["+error"]);
    router.expect("/user/profile").path("user/profile").error(["user/+error"]);
  });

  test.case("non-recursive only local", assert => {
    const router = init(assert, ["index", "user/+error", "user/deep/profile"]);
    router.expect("/").path("index").specials({});
    router.expect("/user/deep/profile").path("user/deep/profile")
      .error(["user/+error"]);
  });

  test.case("mixed recursive and non-recursive in nested", assert => {
    const router = init(assert, [
      "index",
      "+layout",
      "user/+guard",
      "user/+error",
      "user/profile",
    ]);
    router.expect("/user/profile").path("user/profile").specials({
      error: ["user/+error"],
      guard: ["user/+guard"],
      layout: ["+layout"],
    });
  });

  test.case("root-level recursive applies to all", assert => {
    const router = init(assert, ["index", "+guard", "user/profile"]);
    router.expect("/").path("index").guard(["+guard"]);
    router.expect("/user/profile").path("user/profile").guard(["+guard"]);
  });

  test.case("no collection if no applicable specials", assert => {
    const router = init(assert, ["index", "user/profile"]);
    router.expect("/").path("index").specials({});
    router.expect("/user/profile").path("user/profile").specials({});
  });

  test.case("multiple same type at levels (recursive)", assert => {
    const specials = ["+layout", "user/+layout", "user/deep/+layout"];
    const router = init(assert, ["index", ...specials, "user/deep/profile"]);
    router.expect("/user/deep/profile").path("user/deep/profile")
      .layout(specials.toReversed());
  });

  test.case("no-conflict with same-named non-special", assert => {
    const router = init(assert, ["index", "+layout", "layout"]);
    router.expect("/layout").path("layout").layout(["+layout"]);
  });

  test.case("init throws on duplicate specials", assert => {
    assert(() => init(assert, ["index", "+layout", "user/+layout", "user/+layout"]))
      .throws(Code.double_route);
  });

  test.case("applies to dynamic routes with params", assert => {
    const router = init(assert, [
      "index",
      "+layout",
      "user/[id]/+guard",
      "user/[id]/profile",
    ]);
    router.expect("/user/42/profile").path("user/[id]/profile")
      .param("id", "42")
      .layout(["+layout"])
      .guard(["user/[id]/+guard"]);
  });

  test.case("skip non-recursive when already found", assert => {
    const router = init(assert, [
      "+error",
      "user/+error",
      "user/deep/+error",
      "user/deep/profile",
    ]);
    router.expect("/user/deep/profile").path("user/deep/profile")
      .error(["user/deep/+error"]);
  });
});

test.group("general", () => {
  test.case("mixed routes with specials and normalization", assert => {
    const router = init(assert, [
      "index",
      "+layout",
      "blog/[slug]",
      "blog/+error",
      "blog/archive/index",
    ]);
    router.expect("/blog/my-post").path("blog/[slug]")
      .param("slug", "my-post")
      .layout(["+layout"])
      .error(["blog/+error"]);

    router.expect("/blog/archive//index").path("blog/archive/index")
      .layout(["+layout"])
      .error(["blog/+error"]);

    router.expect("/blog").fail();
  });
});

test.group("depth", () => {
  test.case("max with specials", assert => {
    const router = init(assert, [
      "+layout",
      "user/+layout",
      "user/deep/profile",
    ]);
    assert(router.depth("layout")).equals(2);
    assert(router.depth("guard")).equals(1);
    assert(router.depth("error")).equals(1);
  });
});
