import type { DebrisTestSuite } from "@rcompat/core";
import extend from "./extend.js";

export default (test => {
  test.case("typedoc", assert => {
   assert(extend({}, { foo: "bar" })).equals({ foo: "bar" });
   assert(extend({ foo: "bar" }, { foo: "baz" })).equals({ foo: "baz" });
   assert(extend({ foo: { bar: "baz" } }, { foo: { bar: "baz2"} }))
      .equals({ foo: { bar: "baz2"} });
  });

  test.case("faulty params", assert => {
    const extension = { key: "value" };
    const base = { keys: "values" };
    assert(() => extend(undefined as never, undefined as never)).throws();
    assert(() => extend(undefined as never, extension)).throws();
    assert(() => extend(base, undefined as never)).throws();
  });

  test.case("base and extension same", assert => {
    const object = { key: "value" };
    assert(extend(object, object)).equals(object);
  });

  test.case("one property", assert => {
    const base = { key: "value" };
    const extension = { key: "value2" };
    assert(extend(base, extension)).equals(extension);
  });

  test.case("two properties, one replaced", assert => {
    const base = { key: "value", key2: "value2" };
    const extension = { key: "other value" };
    const extended = { key: "other value", key2: "value2" };
    assert(extend(base, extension)).equals(extended);
  });

  test.case("arrays overwritten", assert => {
    const base = { key: ["value", "value2"] };
    const extension = { key: ["value3", "value4"] };
    assert(extend(base, extension)).equals(extension);
  });

  test.case("one property of a subobject", assert => {
    const base = { key: { subkey: "subvalue" } };
    const extension = { key: { subkey: "subvalue 2" } };
    assert(extend(base, extension)).equals(extension);
  });

  test.case("two properties of a subobject, one replaced", assert => {
    const base = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
    const extension = { key: { subkey: "subvalue 2" } };
    const extended = { key: { subkey: "subvalue 2", subkey2: "subvalue2" } };
    assert(extend(base, extension)).equals(extended);
  });

  test.case("function", assert => {
    {
      const fn = () => undefined;
      const base = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
      const extension = { key: { subkey: fn } };
      const extended = { key: { subkey: fn, subkey2: "subvalue2" } };
      assert(extend(base, extension)).equals(extended);
    }
    {
      const fn = () => undefined;
      const base = { key: { subkey: fn } };
      const extension = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
      const extended = { key: { subkey: "subvalue", subkey2: "subvalue2" } };
      assert(extend(base, extension)).equals(extended);
    }
    {
      const fn = () => undefined;
      const base = { fn, foo: "bar" };
      const extension = { fn: { foo: "bar" }, fn2: { bar: "baz" } };
      const extended = { fn: { foo: "bar" }, foo: "bar", fn2: { bar: "baz" } };
      assert(extend(base, extension)).equals(extended);
    }
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
        public: "public",
        static: "static",
        routes: "routes",
        components: "components",
      },
    };

    const additional = {
      debug: true,
      environment: "testing",
      defaults: {
        context: "user",
        mode: "operational",
      },
      paths: {
        client: "client",
      },
    };

    const extended = {
      base: "/",
      debug: true,
      environment: "testing",
      defaults: {
        action: "index",
        context: "user",
        mode: "operational",
      },
      paths: {
        client: "client",
        public: "public",
        static: "static",
        routes: "routes",
        components: "components",
      },
    };

    assert(extend(base, additional)).equals(extended);
  });
}) satisfies DebrisTestSuite;
