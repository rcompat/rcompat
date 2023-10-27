import Nothing from "./Nothing.js";

export default class Just {
  static is(value) {
    return !Nothing.is(value);
  }
}
