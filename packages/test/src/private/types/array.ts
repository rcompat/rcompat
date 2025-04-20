import equals from "#equals";
import includes from "#includes";

const is = (x: unknown): x is unknown[] => Array.isArray(x);

const partial = <t extends unknown[]>(x: t, y: t) =>
  x.reduce<boolean>((equal, xi, i) =>
    equal && equals(xi, y[i]), true);

const equal = <T extends unknown[]>(x: T, y: T) =>
  partial(x, y) && partial(y, x);

const include = <T extends unknown[]>(x: T, y: T) => {
  // empty array is always included
  if (y.length === 0) {
    return true;
  }

  if (x.length < y.length) {
    return false;
  }
  // find index of first member
  const index = x.findIndex(m => includes(m, y[0]));

  // not found
  if (index === -1) {
    return false;
  }

  // assert subarray size can match
  if (x.slice(index).length < y.length) {
    return false;
  }

  // compare rest of members from y[1]]
  return y.slice(1).reduce<boolean>((included, member, i) =>
    included && includes(x[index + i + 1], member), true);
};

export default { equal, include, is, partial };
