import MatchedRoute from "#router/MatchedRoute";
import type NodeConfig from "#router/NodeConfig";
import NodePredicate from "#router/NodePredicate";
import * as errors from "./errors.js";

type Match = MatchedRoute | undefined;

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

const to_type = (path: string) => {
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

type Params = Record<PropertyKey, unknown>;

export default class Node {
  #parent: Node | null;
  #children: Node[] = [];
  #path: string;
  #type: symbol;
  #fullpath?: string;
  static #config: NodeConfig;

  static set config(config: NodeConfig) {
    this.#config = { ...config };
  }

  static get config() {
    return this.#config;
  }

  constructor(parent: Node | null, path: string, fullpath?: string) {
    this.#parent = parent;
    this.#type = to_type(path);
    this.#path = path.startsWith("[[") ? path.slice(1, -1) : path;
    this.#fullpath = fullpath;
  }

  get parent() {
    return this.#parent;
  }

  get path() {
    return this.#path;
  }

  get fullpath() {
    return this.#fullpath;
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
    return this.#children.length === 0;
  }

  get has_fullpath() {
    return this.fullpath !== undefined;
  }

  check(predicate: NodePredicate) {
    predicate(this);

    for (const child of this.#children) {
      child.check(predicate);
    }
  }

  statics() {
    return this.#children.filter(child => child.type === STATIC);
  }

  optionals() {
    return this.#children.filter(({ type }) =>
      type === OPTIONAL_CATCH || type === OPTIONAL_REST);
  }

  dynamics() {
    return this.#children.filter(child => child.dynamic);
  }

  specials() {
    return this.#children.filter(child => child.type === SPECIAL);
  }

  // collects depth values for all nodes that satisfy a predicate, returning
  // the highest max
  max(predicate: NodePredicate, depth = 1) {
    const max = predicate(this) ? [depth] : [depth - 1];
    for (const child of this.#children) {
      max.push(child.max(predicate, depth + 1));
    }
    return Math.max(...[...max].flat());
  }

  collect(collected: { [s in string]?: string[] } = {}, recursed = false): { [s in string]?: string[] } {
    const { parent } = this;

    // root
    if (parent === null) {
      return collected;
    }
    for (const { path, fullpath } of parent.specials()) {
      const name = path.slice(1);
      const { recursive } = Node.#config.specials?.[name] ?? {};
      // skip non-recursive specials
      if (recursed && !recursive) {
        continue;
      }
      const arr = collected[name] === undefined ? [] : collected[name];
      collected[name] = arr.concat(fullpath as never);
    }
    return parent.collect(collected, true);
  }

  filed(path: string, fullpath: string) {
    this.#children.push(new Node(this, path, fullpath));
  }

  interim(path: string) {
    for (const child of this.#children) {
      if (child.path === path) {
        return child;
      }
    }
    const interim = new Node(this, path);
    this.#children.push(interim);
    return interim;
  }

  next(request: Request, parts: string[], match_catch: boolean, params: Params) {
    // match static routes first
    for (const child of this.statics()) {
      const matched = child.match(request, parts, match_catch, params);
      if (matched !== undefined) {
        return matched;
      }
    }
    // then match dynamic routes
    for (const child of this.dynamics()) {
      const matched = child.match(request, parts, match_catch, params);
      if (matched !== undefined) {
        return matched;
      }
    }
  }

  return(_request: never, parts: string[], match_catch: boolean, params: Params, fullpath = this.#fullpath): Match {
    const path = this.#path;
    const specials = this.collect();

    // static match
    if (this.#path === parts[0]) {
      return { path, fullpath: fullpath as string, specials: specials, params };
    }
    // catch always matches
    if (match_catch && this.catch) {
      return {
        path, fullpath: fullpath as string, specials,
        params: {
          ...params,
          [this.#path.slice(1, -1)]: parts[0],
        },
      };
    }
    if (match_catch && this.rest) {
      const name = this.#path.slice(4, -1);
      return {
        path, fullpath: fullpath as string, specials,
        params: {
          ...params,
          [name]: params[name] ? params[name] : parts[0],
        },
      };
    }
  }

  #match_anchor(request: Request, parts: string[], match_catch: boolean, params: Params) {
    if (this.#fullpath !== undefined) {
      return this.return(request as never, parts, match_catch, params);
    }
    const [{ type = undefined, fullpath = undefined } = {}] = this.dynamics();

    // this node has no file, but might have an OPTIONAL_CATCH child
    if (type === OPTIONAL_CATCH) {
      return this.return(request as never, parts, match_catch, params, fullpath);
    }
    // this node has no file, but might have an OPTIONAL_REST field
    if (type === OPTIONAL_REST) {
      return this.return(request as never, parts, match_catch, params, fullpath);
    }
  }

  #match_recurse(request: Request, parts: string[], match_catch: boolean, params: Params) {
    const [first, ...rest] = parts;

    // current path matches first
    // static match is first
    if (this.#path === first) {
      return this.next(request, rest, match_catch, params);
    }
    if (this.catch) {
      const next_params = { ...params, [this.#path.slice(1, -1)]: first };
      return this.next(request, rest, match_catch, next_params);
    }
    if (this.rest) {
      const name = this.#path.slice(4, -1);
      const next_params = {
        ...params,
        [name]: `${first}/${rest.join("/")}`,
      };
      // rest stops recursing
      return this.return(request as never, [first, ...rest], match_catch, next_params);
    }
  }

  match(request: Request, parts: string[], match_catch = true, params = {}): Match {
    // root node itself cannot be matched
    if (this.#type === ROOT) {
      return this.next(request, parts, match_catch, params);
    }
    // anchor
    if (parts.length === 1) {
      return this.#match_anchor(request, parts, match_catch, params);
    }

    return this.#match_recurse(request, parts, match_catch, params);
  }

  flatten(): { path: string, fullpath: string | undefined, type: symbol }[] {
    const children = this.#children.map(child => ({
      path: child.path, fullpath: child.fullpath, type: child.type,
    }));

    const subchildren = this.leaf
      ? []
      : this.#children.flatMap(child => child.flatten());

    return children.concat(subchildren);
  }

  print(i = 0) {
    console.log(`${"-".repeat(i)}${this.#path} (${type_to_string(this.#type)})`);
    for (const child of this.#children) {
      child.print(i + 1);
    }
  }

  unique() {
    const children = this.#children;

    Object.entries(children.reduce((counts: Record<string, number>, child) =>
      ({ ...counts, [child.path]: (counts[child.path] ?? 0) + 1 })
      , {})).map(([path, count]) => {
        if (count > 1) {
          throw new errors.DoubleRoute(path);
        }
      });

    const has_optionals = this.optionals().length > 0;
    if (has_optionals && this.has_fullpath) {
      throw new errors.DoubleRoute(this.path);
    }

    for (const $static of this.statics()) {
      if ($static.path === "index" && $static.fullpath !== undefined) {
        if (this.#type === STATIC && this.has_fullpath) {
          throw new errors.DoubleRoute(this.path);
        }
        if (has_optionals) {
          throw new errors.DoubleRoute(this.path);
        }
      }
    }
  }
}
