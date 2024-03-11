const orIdentity = fn => fn ?? (v => v);

export default class Either {
  #left; #right;

  static right(value) {
    return new Either(undefined, value);
  }

  static left(value) {
    return new Either(value);
  }

  static try(computation) {
    try {
      return Either.right(computation());
    } catch (error) {
      return Either.left(error);
    }
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
      ? Either.right(mapper(this.#right))
      : Either.left(mapper(this.#left));
  }

  flat() {
    return this.get() instanceof Either ? this.get() : this;
  }

  flatMap(mapper) {
    return this.map(mapper).flat();
  }

  match(matcher = {}) {
    return this.isRight()
      ? Either.right(orIdentity(matcher.right)(this.#right))
      : Either.left(orIdentity(matcher.left)(this.#left));
  }
}
