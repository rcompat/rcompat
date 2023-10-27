import Eager from "./Eager.js";

const orIdentity = fn => fn ?? (v => v);

export default class EagerEither {
  #left; #right;

  static right(value) {
    return Eager.resolve(new EagerEither(undefined, value));
  }

  static left(value) {
    return Eager.resolve(new EagerEither(value));
  }

  static try(computation) {
    return new Eager(resolve =>
      (async () => computation())().then(
        rightValue => resolve(EagerEither.right(rightValue)),
        leftValue => resolve(EagerEither.left(leftValue))));
  }

  constructor(left, right) {
    if (left === undefined) {
      this.#right = right;
    } else {
      this.#left = left;
    }
  }

  isRight() {
    return this.#right !== undefined;
  }

  isLeft() {
    return !this.isRight();
  }

  get() {
    return this.isRight() ? this.#right : this.#left;
  }

  map(mapper) {
    return this.isRight()
      ? EagerEither.right(mapper(this.#right))
      : EagerEither.left(mapper(this.#left));
  }

  flat() {
    const side = this.isRight() ? "right" : "left";
    return EagerEither[side](this.get().then(value =>
      value instanceof EagerEither ? this.get() : this,
    )).get();
  }

  flatMap(mapper) {
    return this.map(mapper).flat();
  }

  match(matcher = {}) {
    return this.isRight()
      ? EagerEither.right(orIdentity(matcher.right)(this.#right))
      : EagerEither.left(orIdentity(matcher.left)(this.#left));
  }
}
