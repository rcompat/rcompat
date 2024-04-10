const ROOT = Symbol("root");
const SPECIAL = Symbol("special");
const STATIC = Symbol("static");
const CATCH = Symbol("catch");
const OPTIONAL_CATCH = Symbol("optional-catch");
const CATCH_ALL = Symbol("catch-all");
const OPTIONAL_CATCH_ALL = Symbol("optional-catch-all");

const type_to_string = symbol => {
  if (symbol === ROOT) {
    return "root";
  }
  if (symbol === SPECIAL) {
    return "special";
  }
  if (symbol === STATIC) {
    return "static";
  }
  if (symbol === CATCH) {
    return "catch";
  }
  if (symbol === OPTIONAL_CATCH) {
    return "optional-catch";
  }
  if (symbol === CATCH_ALL) {
    return "catch-all";
  }
  if (symbol === OPTIONAL_CATCH_ALL) {
    return "optional-catch-all";
  }
};

const to_type = path => {
  if (path.startsWith("+")) {
    return SPECIAL;
  }
  if (path.startsWith("[[...")) {
    return OPTIONAL_CATCH_ALL;
  }
  if (path.startsWith("[...")) {
    return CATCH_ALL;
  }
  if (path.startsWith("[[")) {
    return OPTIONAL_CATCH;
  }
  if (path.startsWith("[")) {
    return CATCH;
  }
  if (path === "$") {
    return ROOT;
  }
  return STATIC;
};

export default class Node {
  #children = [];
  #path;
  #type;
  #file;

  constructor(path, file) {
    this.#type = to_type(path);
    this.#path = path;
    this.#file = file;
  }

  check(predicate) {
    const check = predicate(this);
    if (check !== undefined) {
      return check();
    }
    for (const child of this.#children) {
      const checked = child.check(predicate);
      if (checked !== undefined) {
        return checked;
      }
    }
  }

  statics() {
    return this.#children.filter(child => child.type === STATIC);
  }

  catches() {
    return this.#children.filter(child => child.type === CATCH);
  }

  filed(path, file) {
    this.#children.push(new Node(path, file));
  }

  interim(path) {
    for (const child of this.#children) {
      if (child.path === path) {
        return child;
      }
    }
    const interim = new Node(path);
    this.#children.push(interim);
    return interim;
  }

  try_match(parts, match_catch, params) {
    // match static routes first
    for (const child of this.statics()) {
      const matched = child.match(parts, match_catch, params);
      if (matched !== undefined) {
        return matched;
      }
    }
    // then match catch routes
    for (const child of this.catches()) {
      const matched = child.match(parts, match_catch, params);
      if (matched !== undefined) {
        return matched;
      }
    }
  }

  match(parts, match_catch = true, params = {}) {
    // root node itself cannot be matched
    if (this.#type === ROOT) {
      return this.try_match(parts, match_catch, params);
    }
    // anchor
    if (parts.length === 1) {
      if (this.#file !== undefined) {
        // static match
        if (this.#path === parts[0]) {
          return {
            path: this.#path,
            file: this.#file,
            params,
          };
        }
        // catch always matches
        if (match_catch && this.#type === CATCH) {
          return {
            path: this.#path,
            file: this.#file,
            params: {
              ...params,
              [this.#path.slice(1, -1)]: parts[0],
            },
          };
        }
      }
    } else {
      // current path matches first
      const is_catch = match_catch && this.#type === CATCH;
      if (this.#path === parts[0] || is_catch) {
        const next_params = is_catch
          ? { ...params, [this.#path.slice(1, -1)]: parts[0] }
          : params;
        return this.try_match(parts.slice(1), match_catch, next_params);
      }
    }
  }

  print(i = 0) {
    console.log(`${"-".repeat(i)}${this.#path} (${type_to_string(this.#type)})`);
    for (const child of this.#children) {
      child.print(i + 1);
    }
  }

  get path() {
    return this.#path;
  }

  get type() {
    return this.#type;
  }
}
