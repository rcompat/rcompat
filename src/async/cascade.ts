import { is } from "rcompat/invariant";
import { identity } from "rcompat/function";

// {{{ explanation
// given a list of functions that accept `(input, next)` with the general
// expectation they call `next(maybe_transformed_input)`, resolve them
// returning the transformed input
//
// This is essentially a form of currying, where given
// [fn0, fn1, ... fn[N]], this structure is produced:
// fn0(input, fn0_out => fn1(fn0_out, fn1_out => ... fn[N](fn[N-1]_out)))
//
// fn[N] is expected *not* to call `next`, and is if omitted a noop (identity)
//
// Midchain breakages can be deemed acceptable in some scenarios, where a
// function may elect to determine the output is done and not call `next`
//
// reduce here essentially wraps every function, starting from the last, then
// the next last, until the first function is the outermost wrapper, executed
// first
// }}}
export default (fns: Function[], final_fn = identity) => {
  is(fns).array();

  return fns.reduceRight(async (next, fn: Function) =>
    (value: unknown) =>
      next.then(n =>
        fn(value, n)), Promise.resolve(final_fn));
};
