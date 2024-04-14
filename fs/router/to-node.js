const ROOT = Symbol("root");
const SPECIAL = Symbol("special");
const STATIC = Symbol("static");
const CATCH = Symbol("catch");
const OPTIONAL_CATCH = Symbol("optional-catch");
const REST = Symbol("rest");
const OPTIONAL_REST = Symbol("optional-rest");

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
  if (symbol === REST) {
    return "rest";
  }
  if (symbol === OPTIONAL_REST) {
    return "optional-rest";
  }
};

const to_type = path => {
  if (path.startsWith("+")) {
    return SPECIAL;
  }
  if (path.startsWith("[[...")) {
    return OPTIONAL_REST;
  }
  if (path.startsWith("[...")) {
    return REST;
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

export default config => class Node {
  #parent;
  #children = [];
  #path;
  #type;
  #file;

  constructor(parent, path, file) {
    this.#parent = parent;
    this.#type = to_type(path);
    this.#path = path.startsWith("[[") ? path.slice(1, -1) : path;
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

  dynamics() {
    return this.#children.filter(child => child.dynamic);
  }

  specials() {
    return this.#children.filter(child => child.type === SPECIAL);
  }

  collect(collected = {}, recursed = false) {
    const { parent } = this;
    // root
    if (this.parent === null) {
      return collected;
    }
    for (const { path, file } of parent.specials()) {
      const name = path.slice(1);
      const { recursive } = config[name];
      // skip non-recursive specials
      if (recursed && !recursive) {
        continue;
      }
      const arr = collected[path] === undefined ? [] : collected[path];
      collected[path] = arr.concat(file);
    }
    return parent.collect(collected, true);
  }

  filed(path, file) {
    this.#children.push(new Node(this, path, file));
  }

  interim(path) {
    for (const child of this.#children) {
      if (child.path === path) {
        return child;
      }
    }
    const interim = new Node(this, path);
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
    // then match dynamic routes
    for (const child of this.dynamics()) {
      const matched = child.match(parts, match_catch, params);
      if (matched !== undefined) {
        return matched;
      }
    }
  }

  get dynamic() {
    return this.catch || this.rest;
  }

  get catch() {
    return this.type === CATCH || this.type === OPTIONAL_CATCH;
  }

  get rest() {
    return this.type === REST || this.type === OPTIONAL_REST;
  }

  get optional() {
    return this.type === OPTIONAL_CATCH || this.type === OPTIONAL_REST;
  }

  get leaf() {
    return this.#children.length === 0;
  }

  return(parts, match_catch, params, file = this.#file) {
    // static match
    if (this.#path === parts[0]) {
      return {
        path: this.#path,
        file,
        params,
        specials: this.collect(),
      };
    }
    // catch always matches
    if (match_catch && this.catch) {
      return {
        path: this.#path,
        file,
        params: {
          ...params,
          [this.#path.slice(1, -1)]: parts[0],
        },
        specials: this.collect(),
      };
    }
    if (match_catch && this.rest) {
      const name = this.#path.slice(4, -1);
      return {
        path: this.#path,
        file,
        params: {
          ...params,
          [name]: params[name] ? params[name] : parts[0],
        },
        specials: this.collect(),
      };
    }
  }

  #match_anchor(parts, match_catch, params) {
    if (this.#file !== undefined) {
      return this.return(parts, match_catch, params);
    }
    const [{ type, file } = {}] = this.dynamics();
    // this node has no file, but might have an OPTIONAL_CATCH child
    if (type === OPTIONAL_CATCH) {
      return this.return(parts, match_catch, params, file);
    }
    // this node has no file, but might have an OPTIONAL_rest field
    if (type === OPTIONAL_REST) {
      return this.return(parts, match_catch, params, file);
    }
  }

  #match_recurse([first, ...rest], match_catch, params) {
    // current path matches first
    const is_catch = match_catch && this.catch;
    const is_rest = this.rest;
    const is_static = this.#path === first;

    // static match is first
    if (is_static) {
      return this.try_match(rest, match_catch, params);
    }
    if (is_catch) {
      const next_params = { ...params, [this.#path.slice(1, -1)]: first };
      return this.try_match(rest, match_catch, next_params);
    }
    if (is_rest) {
      const name = this.#path.slice(4, -1);
      const next_params = {
          ...params,
        [name]: `${first}/${rest.join("/")}`,
      };
      // rest stops recursing
      return this.return([first, ...rest], match_catch, next_params);
    }
  }

  match(parts, match_catch = true, params = {}) {
    // root node itself cannot be matched
    if (this.#type === ROOT) {
      return this.try_match(parts, match_catch, params);
    }
    // anchor
    if (parts.length === 1) {
      return this.#match_anchor(parts, match_catch, params);
    }

    return this.#match_recurse(parts, match_catch, params);
  }

  print(i = 0) {
    console.log(`${"-".repeat(i)}${this.#path} (${type_to_string(this.#type)})`);
    for (const child of this.#children) {
      child.print(i + 1);
    }
  }

  get parent() {
    return this.#parent;
  }

  get path() {
    return this.#path;
  }

  get file() {
    return this.#file;
  }

  get type() {
    return this.#type;
  }
};
