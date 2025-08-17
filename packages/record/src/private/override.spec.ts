import non_records from "#non-records";
import override from "#override";
import test from "@rcompat/test";
import any from "@rcompat/test/any";
import undef from "@rcompat/test/undef";

test.case("typedoc", assert => {
  assert(override({}, { foo: "bar" })).equals({ foo: "bar" });
  assert(override({ foo: "bar" }, { foo: "baz" })).equals({ foo: "baz" });
  assert(override({ foo: { bar: "baz" } }, { foo: { bar: "baz2"} }))
    .equals({ foo: { bar: "baz2"} });
});

test.case("faulty params", assert => {
  const base = { keys: "values" };
  const over = { key: "value" };
  assert(() => override(undef, undef)).throws();
  assert(() => override(undef, over)).throws();
  assert(() => override(base, undef)).throws();
  non_records.forEach(non_record => {
    assert(() => override(any(non_record), { foo: "bar" })).throws();
    assert(() => override({ foo: "bar" }, any(non_record))).throws();
  });
});

test.case("base and over same", assert => {
  const object = { key: "value" };
  assert(override(object, object)).equals(object);
});

test.case("one property", assert => {
  const base = { key: "value" };
  const over = { key: "value2" };
  assert(override(base, over)).equals(over);
});

test.case("two properties, one replaced", assert => {
  const base = { key: "value", key2: "value2" };
  const over = { key: "other value" };
  const overridden = { key: "other value", key2: "value2" };
  assert(override(base, over)).equals(overridden);
});

test.case("arrays overwritten", assert => {
  const base = { key: ["value", "value2"] };
  const over = { key: ["value3", "value4"] };
  assert(override(base, over)).equals(over);
});

test.case("one property of a subobject", assert => {
  const base = { key: { subkey: "subvalue" } };
  const over = { key: { subkey: "subvalue 2" } };
  assert(override(base, over)).equals(over);
});

test.case("two properties of a subobject, one replaced", assert => {
  const base = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
  const over = { key: { subkey: "subvalue 2" } };
  const overridden = { key: { subkey: "subvalue 2", subkey2: "subvalue2" } };
  assert(override(base, over)).equals(overridden);
});

test.case("function", assert => {
  /*{
    const fn = () => undefined;
    const base = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
    const over = { key: { subkey: fn } };
    const overridden = { key: { subkey: fn, subkey2: "subvalue2" } };
    assert(override(base, over)).equals(overridden);
  }*/
  {
    const fn = () => undefined;
    const base = { key: { subkey: fn } };
    const over = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
    const overridden = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
    assert(override(base, over)).equals(any(overridden));
  }
  {
    const fn = () => undefined;
    const base = { fn, foo: "bar" };
    const over = { fn: { foo: "bar" }, fn2: { bar: "baz" } };
    const overridden = { fn: { foo: "bar" }, fn2: { bar: "baz" }, foo: "bar" };
    assert(override(base, over)).equals(any(overridden));
  }
});

test.case("arrays don't recurse", assert => {
  const base = {
    modules: [],
  };

  const over = {
    modules: [{ name: "primate:htmx" } ],
  };

  assert(override(base, over)).equals(any(over));
});

test.case("config enhancement", assert => {
  const base = {
    base: "/",
    debug: false,
    defaults: {
      action: "index",
      context: "guest",
    },
    paths: {
      components: "components",
      public: "public",
      routes: "routes",
      static: "static",
    },
  };

  const additional = {
    debug: true,
    defaults: {
      context: "user",
      mode: "operational",
    },
    environment: "testing",
    paths: {
      client: "client",
    },
  };

  const overridden  = {
    base: "/",
    debug: true,
    defaults: {
      action: "index",
      context: "user",
      mode: "operational",
    },
    environment: "testing",
    paths: {
      client: "client",
      components: "components",
      public: "public",
      routes: "routes",
      static: "static",
    },
  };

  assert(override(base, additional)).equals(overridden);
});
