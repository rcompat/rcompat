export default class Nothing {
  static get value() {
    return undefined;
  }

  static is(value) {
    return value === undefined || value === null;
  }
}
