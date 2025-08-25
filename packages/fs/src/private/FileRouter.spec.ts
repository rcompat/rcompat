import FileRouter from "#FileRouter";
import test from "@rcompat/test";

const specials = {
  error: { recursive: false },
  guard: { recursive: true },
  layout: { recursive: true },
};

function init(objects: string[]) {
  return FileRouter.init({ extensions: [".ts"], specials }, objects);
}

function request(path: string) {
  return new Request(`http://test${path}`);
}

test.case("static: normalization (slashes, explicit index)", assert => {
  // only `static` exists; `static/index` would error as doubled
  const router = init(["index", "static"]);

  const expect = (p: string) => {
    const m = router.match(request(p));
    assert(!!m).true();
    assert(m!.fullpath).equals("static");
  };

  expect("/static");
  expect("//static");
  expect("/static/");
  expect("//static/");
  expect("/static//");
  expect("//static//");
  expect("/static/index");
  expect("/static/index/");
  expect("/static//index");
  expect("//static//index//");
  expect("//static//index///");
  assert(router.match(request("//static//index//index"))).undefined();
});

test.case("root index and normalization", assert => {
  const router = init(["index"]);

  const expect = (p: string) => {
    const m = router.match(request(p));
    assert(!!m).true();
    assert(m!.fullpath).equals("index");
  };

  expect("/");
  expect("//");
  expect("/index");
  expect("/index/");
  expect("//index//");
});

test.case("static overrides dynamic in same directory", assert => {
  // one dynamic child allowed: [id] plus a static sibling "profile"
  const router = init(["index", "profile", "[id]"]);

  // /profile should resolve to static "profile"
  const p1 = router.match(request("/profile"));
  assert(!!p1).true();
  assert(p1!.fullpath).equals("profile");

  // /john should resolve to dynamic "[id]"
  const p2 = router.match(request("/john"));
  assert(!!p2).true();
  assert(p2!.fullpath).equals("[id]");
  assert(p2!.params["id"]).equals("john");
});

test.case("dynamic: single-segment param decoding", assert => {
  const router = init(["index", "user/[name]"]);

  const m = router.match(request("/user/hello%20world"));
  assert(!!m).true();
  assert(m!.fullpath).equals("user/[name]");
  assert(m!.params["name"]).equals("hello world");
});

test.case("dynamic: invalid encodings are preserved", assert => {
  const router = init(["index", "user/[name]"]);

  // %E0%A4%A is invalid: decodeURIComponent throws; router keeps raw
  const m = router.match(request("/user/%E0%A4%A"));
  assert(!!m).true();
  assert(m!.fullpath).equals("user/[name]");
  assert(m!.params["name"]).equals("%E0%A4%A");
});

test.case("rest: multi-segment capture and decoding", assert => {
  const router = init(["index", "files/[...path]"]);

  const m1 = router.match(request("/files/a/b/c"));
  assert(!!m1).true();
  assert(m1!.fullpath).equals("files/[...path]");
  assert(m1!.params["path"]).equals("a/b/c");

  const m2 = router.match(request("/files/a%20b/c%20d"));
  assert(!!m2).true();
  assert(m2!.fullpath).equals("files/[...path]");
  assert(m2!.params["path"]).equals("a b/c d");

  // rest param is required; /files should NOT match
  const m3 = router.match(request("/files"));
  assert(m3).undefined();
});

test.case("optional (catch) at non-root directory", assert => {
  // only one dynamic in "opt": [[id]]
  const router = init(["index", "opt/[[id]]"]);

  // /opt -> optional param absent
  const m1 = router.match(request("/opt"));
  assert(!!m1).true();
  assert(m1!.fullpath).equals("opt/[[id]]");
  assert(m1!.params["id"]).equals(undefined);

  // /opt/jane -> optional param present
  const m2 = router.match(request("/opt/jane"));
  assert(!!m2).true();
  assert(m2!.fullpath).equals("opt/[[id]]");
  assert(m2!.params["id"]).equals("jane");
});

test.case("optional (catch) at root — empty param", assert => {
  // root has only one dynamic: [[who]]
  const router = init(["[[who]]"]);

  // "/" should match the optional catch at root
  const m = router.match(request("/"));
  assert(!!m).true();
  assert(m!.fullpath).equals("[[who]]");
  assert(m!.params["who"]).equals(undefined);
});

test.case("optional rest at root — empty param", assert => {
  // separate fixture to avoid >1 dynamic in the same (root) directory
  const router = init(["[[...rest]]"]);

  const m1 = router.match(request("/"));
  assert(!!m1).true();
  assert(m1!.fullpath).equals("[[...rest]]");
  assert(m1!.params["rest"]).equals(undefined);

  const m2 = router.match(request("/a/b"));
  assert(!!m2).true();
  assert(m2!.fullpath).equals("[[...rest]]");
  assert(m2!.params["rest"]).equals("a/b");
});

test.case("directory index only (no sibling file)", assert => {
  // only `dir/index` exists; `dir` would error as doubled
  const router = init(["index", "dir/index"]);

  const expect = (p: string) => {
    const m = router.match(request(p));
    assert(!!m).true();
    assert(m!.fullpath).equals("dir/index");
  };

  expect("/dir");
  expect("/dir/");
  expect("/dir/index");
  expect("//dir//index//");
});

test.case("deep static paths and normalization", assert => {
  const router = init(["index", "a/b/c"]);

  const expect = (p: string) => {
    const m = router.match(request(p));
    assert(!!m).true();
    assert(m!.fullpath).equals("a/b/c");
  };

  expect("/a/b/c");
  expect("//a//b///c");
  expect("/a/b/c/");
  expect("/a/b/c/index");
});
