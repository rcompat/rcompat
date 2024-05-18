import Either from "./EagerEither.js";

export default test => {
  test.case("right", async assert => {
    assert(await Either.right(true)).instanceof(Either);
  });

  test.case("left", async assert => {
    assert(await Either.left(true)).instanceof(Either);
  });

  test.case("try", async assert => {
    const tryRight = await Either.try(() => true);
    assert(tryRight).instanceof(Either);
    assert(tryRight.get()).true();

    const tryLeft = await Either.try(() => {
      throw new Error();
    });
    assert(tryLeft).instanceof(Either);
    assert(tryLeft.get()).instanceof(Error);
  });

  test.case("#isRight", async assert => {
    assert(await Either.right(true).isRight()).true();
  });

  test.case("#isLeft", async assert => {
    assert(await Either.left(true).isLeft()).true();
  });

  test.case("#get", async assert => {
    assert(await Either.right(true).get()).true();
    assert(await Either.left(true).get()).true();
  });

  test.case("#map", async assert => {
    assert(await Either.right(true).map(v => !v).get()).false();
    assert(await Either.left(true).map(v => !v).get()).false();
  });

  test.case("#flat", async assert => {
    assert(await Either.right(Either.right(true)).flat().get()).equals(true);
    assert(await Either.left(Either.left(true)).flat().get()).equals(true);
  });

  test.case("#flatMap", async assert => {
    assert(await Either.right(0).flatMap(v => Either.right(v + 1)).get())
      .equals(1);
    assert(await Either.left(0).flatMap(v => Either.left(v + 1)).get())
      .equals(1);
  });

  test.case("#match", async assert => {
    assert(await Either.right(true).match({ right: v => !v }).get())
      .equals(false);
    assert(await Either.left(true).match({ left: v => !v }).get())
      .equals(false);
    // default to identity
    assert(await Either.right(true).match().get()).equals(true);
    assert(await Either.left(true).match().get()).equals(true);
  });

  test.case("try+match+get", async assert => {
    const resultSyncComputation = await Either.try(() => 1 / e)
      .match({ left: ({ message }) => message })
      .get();
    assert(resultSyncComputation).equals("e is not defined");
    const resultAsyncComputation = await Either.try(async () => 1 / e)
      .match({ left: ({ message }) => message })
      .get();
    assert(resultAsyncComputation).equals("e is not defined");
  });
};
