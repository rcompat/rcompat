# @rcompat/type

TypeScript utility types for JavaScript runtimes.

## What is @rcompat/type?

A collection of TypeScript utility types for type-level programming. Includes
type predicates, transformations, and common type aliases. Works consistently
across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/type
```

```bash
pnpm add @rcompat/type
```

```bash
yarn add @rcompat/type
```

```bash
bun add @rcompat/type
```

## Usage

### Basic types

```ts
import type Dict from "@rcompat/type/Dict";
import type Maybe from "@rcompat/type/Maybe";
import type Nullish from "@rcompat/type/Nullish";
import type Primitive from "@rcompat/type/Primitive";

// Dict<V> = Record<string, V>
const config: Dict<string> = { host: "localhost", port: "3000" };

// Maybe<T> = T | undefined
function find(id: number): Maybe<User> {
  return users.get(id);
}

// Nullish = null | undefined
function isNullish(value: unknown): value is Nullish {
  return value == null;
}

// Primitive = bigint | boolean | null | number | string | symbol | undefined
function isPrimitive(value: unknown): value is Primitive {
  return value !== Object(value);
}
```

### Type predicates

```ts
import type IsAny from "@rcompat/type/IsAny";
import type IsNever from "@rcompat/type/IsNever";
import type IsUnion from "@rcompat/type/IsUnion";
import type IsTuple from "@rcompat/type/IsTuple";
import type IsArray from "@rcompat/type/IsArray";

// Check if type is `any`
type A = IsAny<any>; // true
type B = IsAny<string>; // false

// Check if type is `never`
type C = IsNever<never>; // true
type D = IsNever<void>; // false

// Check if type is a union
type E = IsUnion<string | number>; // true
type F = IsUnion<string>; // false

// Check if type is a tuple
type G = IsTuple<[string, number]>; // true
type H = IsTuple<string[]>; // false

// Check if type is an array
type I = IsArray<string[]>; // true
type J = IsArray<[string]>; // true (tuples are arrays)
```

### Type transformations

```ts
import type Mutable from "@rcompat/type/Mutable";
import type DeepMutable from "@rcompat/type/DeepMutable";
import type Not from "@rcompat/type/Not";
import type UnionToTuple from "@rcompat/type/UnionToTuple";
import type TupleToUnion from "@rcompat/type/TupleToUnion";

// Remove readonly modifier
type Writable = Mutable<Readonly<{ a: string }>>;
// { a: string }

// Recursively remove readonly
type DeepWritable = DeepMutable<
    Readonly<{ nested: Readonly<{ value: number }> }>
>;
// { nested: { value: number } }

// Boolean negation
type Yes = Not<false>; // true
type No = Not<true>; // false

// Convert union to tuple
type Tuple = UnionToTuple<"a" | "b" | "c">;
// ["a", "b", "c"]

// Convert tuple to union
type Union = TupleToUnion<["a", "b", "c"]>;
// "a" | "b" | "c"
```

### Function types

```ts
import type Newable from "@rcompat/type/Newable";
import type UnknownFunction from "@rcompat/type/UnknownFunction";
import type VoidFunction from "@rcompat/type/VoidFunction";

// Constructor type
function createInstance<T>(Ctor: Newable<T>): T {
  return new Ctor();
}

// Generic function signature
function wrap(fn: UnknownFunction) {
  return (...args: unknown[]) => fn(...args);
}

// No-argument void function
const cleanup: VoidFunction = () => console.log("done");
```

### JSON types

```ts
import type JSONValue from "@rcompat/type/JSONValue";
import type Serializable from "@rcompat/type/Serializable";

// Valid JSON value
const data: JSONValue = {
  name: "Bob",
  age: 30,
  active: true,
  tags: ["admin", "user"],
};

// Implement custom serialization
class User implements Serializable {
  constructor(private id: number, private name: string) {}

  toJSON(): JSONValue {
    return { id: this.id, name: this.name };
  }
}
```

### Async types

```ts
import type MaybePromise from "@rcompat/type/MaybePromise";

// Value or Promise of value
async function process(input: MaybePromise<string>): Promise<string> {
  const value = await input;
  return value.toUpperCase();
}

process("hello"); // works
process(Promise.resolve("hello")); // also works
```

## API Reference

### Basic Types

| Type             | Definition                                                             |
| ---------------- | ---------------------------------------------------------------------- |
| `Dict<V>`        | `Record<string, V>`                                                    |
| `PartialDict<V>` | `Partial<Record<string, V>>`                                           |
| `Entry<K, T>`    | `[K, T]` tuple                                                         |
| `EO`             | Empty object `{}`                                                      |
| `Maybe<T>`       | `T \| undefined`                                                       |
| `Nullish`        | `null \| undefined`                                                    |
| `Primitive`      | `bigint \| boolean \| null \| number \| string \| symbol \| undefined` |
| `Boolish`        | `"true" \| "false"`                                                    |
| `Some<T>`        | `true` if any element in boolean tuple is `true`                       |

### Type Predicates

| Type           | Returns `true` when...  |
| -------------- | ----------------------- |
| `IsAny<T>`     | `T` is `any`            |
| `IsNever<T>`   | `T` is `never`          |
| `IsUnknown<T>` | `T` is `unknown`        |
| `IsVoid<T>`    | `T` is `void`           |
| `IsUnion<T>`   | `T` is a union type     |
| `IsArray<T>`   | `T` is an array type    |
| `IsTuple<T>`   | `T` is a tuple type     |
| `IsClass<T>`   | `T` is a class instance |

### Transformations

| Type                     | Description                            |
| ------------------------ | -------------------------------------- |
| `Mutable<T>`             | Remove `readonly` modifier             |
| `DeepMutable<T>`         | Recursively remove `readonly`          |
| `Not<T>`                 | Boolean negation (`true` ↔ `false`)    |
| `UnionToTuple<U>`        | Convert union to tuple type            |
| `TupleToUnion<T>`        | Convert tuple to union type            |
| `UndefinedToOptional<T>` | Make `undefined` properties optional   |
| `Unpack<T>`              | Flatten/expand type for better display |

### Function Types

| Type                    | Definition                          |
| ----------------------- | ----------------------------------- |
| `Newable<I, A>`         | `new (...args: A) => I`             |
| `AbstractNewable<I, A>` | Abstract constructor type           |
| `UnknownFunction`       | `(...params: unknown[]) => unknown` |
| `VoidFunction`          | `() => void`                        |

### JSON & Serialization

| Type           | Description                                    |
| -------------- | ---------------------------------------------- |
| `JSONValue`    | Valid JSON types (primitives, arrays, objects) |
| `Serializable` | Interface with `toJSON(): JSONValue` method    |
| `JSONPointer`  | JSON pointer path type                         |

### Async Types

| Type              | Definition        |
| ----------------- | ----------------- |
| `MaybePromise<T>` | `T \| Promise<T>` |

### Special Types

| Type          | Description                                   |
| ------------- | --------------------------------------------- |
| `Print<T>`    | Convert type to string literal representation |
| `TypedArray`  | Union of all typed array types                |
| `Join<T, D>`  | Join string tuple with delimiter              |
| `StringLike`  | `string \| { toString(): string }`            |
| `StringClass` | Interface for string-like classes             |
| `Printable`   | Interface with `print(): string` method       |
| `Import<T>`   | Dynamic import result type                    |

## Examples

### Type-safe event emitter

```ts
import type Dict from "@rcompat/type/Dict";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

type Events = Dict<UnknownFunction[]>;

class Emitter<E extends Events> {
  #events: Partial<E> = {};

  on<K extends keyof E>(event: K, handler: E[K][number]) {
    (this.#events[event] ??= [] as E[K]).push(handler);
  }
}
```

### Conditional type utilities

```ts
import type IsUnion from "@rcompat/type/IsUnion";
import type UnionToTuple from "@rcompat/type/UnionToTuple";

type UnionLength<U> = UnionToTuple<U>["length"];

type A = UnionLength<"a" | "b" | "c">; // 3
type B = UnionLength<string>; // 1
```

### JSON validation

```ts
import type JSONValue from "@rcompat/type/JSONValue";

function parseJSON(text: string): JSONValue {
  return JSON.parse(text);
}

function stringify(value: JSONValue): string {
  return JSON.stringify(value);
}
```

### Optional undefined properties

```ts
import type UndefinedToOptional from "@rcompat/type/UndefinedToOptional";

type Input = {
  required: string;
  optional: string | undefined;
};

type Output = UndefinedToOptional<Input>;
// { required: string; optional?: string }
```

## Cross-Runtime Compatibility

| Runtime | Supported |
| ------- | --------- |
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.
