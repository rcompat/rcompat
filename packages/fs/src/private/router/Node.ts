import * as errors from "#router/errors";
import type MatchedRoute from "#router/MatchedRoute";
import type NodeConfig from "#router/NodeConfig";
import type NodePredicate from "#router/NodePredicate";
import type { Dict } from "@rcompat/type";

type Match = MatchedRoute | undefined;
type Params = Dict<string | undefined>;
type Specials = Dict<string[] | undefined>;

const ROOT = Symbol("root");
const SPECIAL = Symbol("special");
const STATIC = Symbol("static");
const CATCH = Symbol("catch");
const OPTIONAL_CATCH = Symbol("optional-catch");
const REST = Symbol("rest");
const OPTIONAL_REST = Symbol("optional-rest");

const type_to_string = (symbol: symbol) => {
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

const to_type = (segment: string) => {
  if (segment.startsWith("+")) {
    return SPECIAL;
  }
  if (segment.startsWith("[[...")) {
    return OPTIONAL_REST;
  }
  if (segment.startsWith("[...")) {
    return REST;
  }
  if (segment.startsWith("[[")) {
    return OPTIONAL_CATCH;
  }
  if (segment.startsWith("[")) {
    return CATCH;
  }
  if (segment === "$") {
    return ROOT;
  }
  return STATIC;
};

function decodeParam(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    // keep invalid encodings as-is
    return s;
  }
};
export default class Node {
  #parent: Node | null;
  #segment: string;
  #type: symbol;
  #path?: string;
  static #config: NodeConfig;
  #statics: Node[] = [];
  #dynamics: Node[] = [];
  #specials: Node[] = [];

  static set config(config: NodeConfig) {
    this.#config = { ...config };
  }

  static get config() {
    return this.#config;
  }

  constructor(parent: Node | null, segment: string, path?: string) {
    this.#parent = parent;
    this.#type = to_type(segment);
    this.#segment = segment.startsWith("[[") ? segment.slice(1, -1) : segment;
    this.#path = path;
  }

  get parent() {
    return this.#parent;
  }

  get segment() {
    return this.#segment;
  }

  get path() {
    return this.#path;
  }

  get type() {
    return this.#type;
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
    return this.#statics.length
      + this.#dynamics.length
      + this.#specials.length === 0;
  }

  get has_path() {
    return this.path !== undefined;
  }

  get #children() {
    return [...this.#statics, ...this.#dynamics, ...this.#specials];
  }

  check(predicate: NodePredicate) {
    predicate(this);

    for (const child of this.#children) {
      child.check(predicate);
    }
  }

  statics() {
    return this.#statics;
  }

  optionals() {
    return this.#dynamics
      .filter(({ type }) => type === OPTIONAL_CATCH || type === OPTIONAL_REST);
  }

  dynamics() {
    return this.#dynamics;
  }

  specials() {
    return this.#specials;
  }

  // collects depth values for all nodes that satisfy a predicate, returning
  // the highest max
  max(predicate: NodePredicate, depth = 1) {
    let max = predicate(this) ? depth : 1;
    for (const child of this.#children) {
      const child_max = child.max(predicate, depth + 1);
      if (child_max > max) {
        max = child_max;
      }
    }
    return max;
  }

  collect(collected: Specials = {}, recursed = new Set<string>()): Specials {
    const { parent } = this;
    if (parent === null) {
      return collected;
    }
    for (const $special of parent.specials()) {
      const name = $special.#segment.slice(1);
      const { recursive } = Node.#config.specials?.[name] ?? {};
      if (!recursive && recursed.has(name)) {
        continue;
      }
      const arr = collected[name] === undefined ? [] : collected[name];
      collected[name] = arr.concat($special.#path as never);
      if (!recursive) {
        recursed.add(name);
      }
    }
    return parent.collect(collected, recursed);
  }

  filed(segment: string, path: string) {
    const child = new Node(this, segment, path);
    if (child.type === SPECIAL) {
      this.#specials.push(child);
    } else if (child.dynamic) {
      this.#dynamics.push(child);
    } else {
      this.#statics.push(child);
    }
  }

  interim(segment: string) {
    const target_array = to_type(segment) === STATIC
      ? this.#statics
      : this.#dynamics;
    for (const child of target_array) {
      if (child.#segment === segment) {
        return child;
      }
    }
    const interim = new Node(this, segment);
    if (interim.type === STATIC) {
      this.#statics.push(interim);
    } else {
      this.#dynamics.push(interim);
    }
    return interim;
  }

  next(parts: string[], params: Params) {
    if (parts.length === 0) return undefined;

    const [first] = parts;
    // prefer static child for the segment if exists
    const static_child = this.#statics.find(child => child.#segment === first);
    if (static_child) {
      // commit to static branch
      return static_child.match(parts, params);
    }
    // no static claimed, try dynamic
    for (const child of this.#dynamics) {
      const matched = child.match(parts, params);
      if (matched !== undefined) {
        return matched;
      }
    }
    return undefined;
  }

  return(parts: string[], params: Params, path = this.#path): Match {
    const segment = this.#segment;
    const specials = this.collect();
    // Static exact match
    if (parts.length > 0 && this.#segment === parts[0]) {
      return { params, path: path as string, segment, specials };
    }
    // For empty parts (end of path)
    if (parts.length === 0) {
      // Required dynamics don't match empty
      if (this.dynamic && !this.optional) {
        return undefined;
      }
      return { params, path: path as string, segment, specials };
    }
    // Dynamic matches (catch/rest) for non-empty
    const next = { ...params };
    if (this.catch) {
      const key = this.#segment.slice(1, -1);
      const captured = parts[0] as string | undefined;
      // Required catch needs a capture
      if (captured === undefined && !this.optional) {
        return undefined;
      }
      if (captured !== undefined) {
        next[key] = decodeParam(captured);
      }
      return { params: next, path: path as string, segment, specials };
    }
    if (this.rest) {
      const name = this.#segment.slice(4, -1);
      const raw = parts.join("/");
      // Required rest needs a non-empty capture
      if (raw === "" && !this.optional) {
        return undefined;
      }
      if (raw !== "") {
        next[name] = decodeParam(raw);
      }
      return { params: next, path: path as string, segment, specials };
    }
  }

  #match_anchor(parts: string[], params: Params) {
    if (this.#path !== undefined) {
      return this.return(parts, params);
    }
    const optional = this.dynamics().find(d => d.optional);
    if (optional) {
      return optional.return([], params, optional.#path);
    }
  }

  #match_recurse(parts: string[], params: Params) {
    if (parts.length === 0) {
      return undefined;
    }
    const [first, ...rest] = parts;

    // current path matches first
    // static match is first
    if (this.#segment === first) {
      return this.next(rest, params);
    }
    if (this.catch) {
      const key = this.#segment.slice(1, -1);
      const next_params = { ...params, [key]: decodeParam(first) };
      return this.next(rest, next_params);
    }
    if (this.rest) {
      const name = this.#segment.slice(4, -1);
      const next_params = { ...params, [name]: parts.join("/") };
      // rest stops recursing
      return this.return([first, ...rest], next_params);
    }
  }

  match(parts: string[], params: Params = {}): Match {

    if (this.#type === ROOT) {
      if (parts.length === 0) {
        const optional = this.dynamics().find(d => d.optional);
        if (optional) {
          return optional.return([], params, optional.#path);
        }
        return undefined;
      }
      return this.next(parts, params);
    }
    if (parts.length <= 1) {
      return this.#match_anchor(parts, params);
    }
    return this.#match_recurse(parts, params);
  }

  flatten(): { path: string | undefined; segment: string; type: symbol }[] {
    const children = this.#children;

    return children.map(({ path, segment, type }) =>
      ({ path, segment, type })).concat(
        this.leaf ? [] : children.flatMap(child => child.flatten()),
      );
  }

  print(i = 0) {
    console.log(`${"-".repeat(i)}${this.#segment} (${type_to_string(this.#type)})`);
    for (const child of this.#children) {
      child.print(i + 1);
    }
  }

  unique() {
    const children = this.#children;

    // Count duplicates by (path,type) so optional vs required don't collide.
    const counts = children.reduce((acc, child) => {
      const key = `${child.#segment}::${child.#type.toString()}`;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Dict<number>);

    for (const [key, count] of Object.entries(counts)) {
      if (count > 1) {
        const seg = key.split("::")[0];
        throw new errors.DoubleRoute(seg);
      }
    }

    const has_optionals = this.optionals().length > 0;

    if (has_optionals && this.has_path) {
      throw new errors.DoubleRoute(this.#segment);
    }

    for (const $static of this.statics()) {
      if ($static.#segment === "index" && $static.#path !== undefined) {
        if (this.#type === STATIC && this.has_path) {
          throw new errors.DoubleRoute(this.#segment);
        }
        if (has_optionals) {
          throw new errors.DoubleRoute(this.#segment);
        }
      }
    }
  }
}
