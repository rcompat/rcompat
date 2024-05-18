import { inconstructible_function } from "rcompat/invariant";

const $promise = Symbol("#promise");

const handler = {
  get(target, property) {
    const promise = target[$promise];

    if (["then", "catch"].includes(property)) {
      return promise[property].bind(promise);
    }

    return Eager.resolve(promise.then(result => property === "bind"
      ? result
      : inconstructible_function(result[property])
        ? result[property].bind(result)
        : result[property]));
  },
  apply(target, that, args) {
    return Eager.resolve(target[$promise].then(result =>
      typeof result === "function" ? result.apply(that, args) : result,
    ));
  },
};

export default class Eager {
  constructor(executor) {
    const promise = new Promise(executor);
    const callable = () => undefined;
    callable[$promise] = promise;
    return new Proxy(callable, handler);
  }

  static resolve(value) {
    return new Eager(resolve => resolve(value));
  }

  static reject(value) {
    return new Eager((_, reject) => reject(value));
  }

  static async tag(strings, ...keys) {
    const last = -1;
    return (await Promise.all(strings.slice(0, last).map(async (string, i) =>
      string + await keys[i],
    ))).join("") + strings.at(last);
  }
}
