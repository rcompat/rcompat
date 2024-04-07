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

  match(parts) {
    // root node itself cannot be matched
    if (this.#type === ROOT) {
      for (const child of this.#children) {
        const matched = child.match(parts);
        if (matched !== undefined) {
          return matched;
        }
      }

    }
    // anchor
    if (parts.length === 1) {
      if (this.#path === parts[0] && this.#file !== undefined) {
        return {
          path: this.#path,
          file: this.#file,
        };
      }
    } else {
      // current path matches first
      if (this.#path === parts[0]) {
        for (const child of this.#children) {
          const matched = child.match(parts.slice(1));
          if (matched !== undefined) {
            return matched;
          }
        }
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
}
