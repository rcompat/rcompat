import Maybe from "./Maybe.js";

export default test => {
  test.case("constructor wraps Just", assert => {
    assert(new Maybe(1).isJust()).true();
  });

  test.case("constructor wraps Nothing", assert => {
    assert(new Maybe().isNothing()).true();
  });

  test.case("`just` returns Just", assert => {
    assert(Maybe.just(1).isJust()).true();
  });

  test.case("`nothing` returns Nothing", assert => {
    assert(Maybe.nothing().isNothing()).true();
  });

  test.case("`map`s Just", assert => {
    const mapped = Maybe.just(1).map(v => v + 1);
    assert(mapped.isJust()).true();
    assert(mapped.get()).equals(2);
  });

  test.case("`map`s Nothing", assert => {
    const mapped = Maybe.nothing().map(v => v + 1);
    assert(mapped.isNothing()).true();
    assert(mapped.get()).undefined();
  });

  test.case("`flatmap`s Just", assert => {
    const mapped = Maybe.just(1).flatMap(v => v + 1);
    assert(mapped).equals(2);
  });

  test.case("`flatmap`s Nothing", assert => {
    const mapped = Maybe.nothing().flatMap(v => v + 1);
    assert(mapped).undefined();
  });

  test.case("`get`s Just", assert => {
    const maybe = Maybe.just(true);
    assert(maybe.get()).true();
  });

  test.case("`get`s Nothing", assert => {
    const maybe = Maybe.nothing();
    assert(maybe.get()).undefined();
  });

  test.case("`isJust` correct", assert => {
    assert(Maybe.just(true).isJust()).true();
    assert(Maybe.just(true).isNothing()).false();
  });

  test.case("`isNothing` correct", assert => {
    assert(Maybe.nothing().isNothing()).true();
    assert(Maybe.nothing().isJust()).false();
  });
};
