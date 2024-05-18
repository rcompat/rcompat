import Eager from "./Eager.js";

export default test => {
  test.case("constructor resolves like promise", async assert => {
    assert(await new Eager(resolve => resolve(1))).equals(1);
  });

  test.case("constructor rejects like promise", assert => {
    assert(() => new Eager((_, reject) => reject({ message: "1" })))
      .throws("1");
  });

  test.case("constructor depth 2", async assert => {
    const object = Promise.resolve({ test: "test2" });
    const eager = Eager.resolve(object);
    assert(await eager.test).equals("test2");
  });

  test.case("constructor depth 3", async assert => {
    const object2 = Promise.resolve({ test2: "test3" });
    const object = Promise.resolve({ test: object2 });
    const eager = Eager.resolve(object);
    assert(await eager.test.test2).equals("test3");
  });

  test.case("constructor with function", async assert => {
    const func = () => ({});
    func.test = "test2";
    const object = Promise.resolve(func);
    const eager = Eager.resolve(object);
    assert(await eager.test).equals("test2");
  });

  test.case("constructor with promised function", async assert => {
    const object = Promise.resolve(() => ({ test: "test2" }));
    const eager = Eager.resolve(object);
    assert(await eager().test).equals("test2");
  });

  test.case("constructor with promised non-function", async assert => {
    const object = Promise.resolve({ test: "test2" });
    const eager = Eager.resolve(object);
    assert(await eager().test).equals("test2");
  });

  test.case("`reject`s like normal promise", assert => {
    assert(() => Eager.reject({ message: "1" })).throws("1");
  });

  test.case("`resolve`s like normal promise", async assert => {
    assert(await Eager.resolve(1)).equals(1);
  });

  test.case("works like a normal tag function", async assert => {
    const name = "Mowgli";
    assert(await Eager.tag`${name}`).equals(`${name}`);
  });

  test.case("works with promises", async assert => {
    const name = Promise.resolve("Mowgli");
    assert(await Eager.tag`${name}`).equals("Mowgli");
  });
};
