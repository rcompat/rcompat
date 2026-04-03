# @rcompat/env

Environment variable loading for JavaScript runtimes.

## Installation

```bash
npm install @rcompat/env
```

```bash
pnpm add @rcompat/env
```

```bash
yarn add @rcompat/env
```

```bash
bun add @rcompat/env
```

## Usage

### Required variables

Use `env.get` when a variable must exist. Throws immediately if missing,
so misconfigured environments fail early and explicitly:

```js
import env from "@rcompat/env";

const url = env.get("DATABASE_URL");   // string, throws if missing
const secret = env.get("API_SECRET");  // string, throws if missing
```

### Optional variables

Use `env.try` when a variable may or may not be present:

```js
import env from "@rcompat/env";

const debug = env.try("DEBUG");        // string | undefined
const nodeEnv = env.try("NODE_ENV");   // string | undefined
```

## API Reference

### `env.get(key)`

```ts
env.get(key: string): string;
```

Returns the value of the environment variable. Throws if the variable is
not set.

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `key`     | `string` | Environment variable name    |

### `env.try(key)`

```ts
env.try(key: string): string | undefined;
```

Returns the value of the environment variable, or `undefined` if not set.
Never throws.

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `key`     | `string` | Environment variable name    |

## File loading

The package looks for the first matching file in your project root:

1. `.env.{NODE_ENV}.local`
2. `.env.{NODE_ENV}`
3. `.env.local`
4. `.env`

If `NODE_ENV` is not set, `JS_ENV` is used as a fallback. Local files (`.local`
suffix) are typically gitignored and used for machine-specific secrets.

## Merging

`process.env` is always the base. The first `.env` file found is layered on top,
so file variables win over system variables.

## Substitution

Variables can reference other variables:

```
FOO=world
BAR=hello$FOO           # helloworld
BAZ=hello${FOO}         # helloworld
ESCAPED=hello\$FOO      # hello$FOO
WITH_DEFAULT=${FOO:-fallback}  # uses fallback if FOO is undefined
```

Substitution resolves against the merged environment, so `process.env` variables
are available too:

```
CONFIG=$HOME/.config/myapp
DB_USERNAME=${DB_USERNAME:-myapp}  # uses system DB_USERNAME or falls back to myapp
```

Single-quoted values skip substitution:

```
FOO='hello$BAR'     # hello$BAR (literal)
```

## Project structure

```
my-project/
├── .env                    # Shared defaults
├── .env.development        # Development settings
├── .env.development.local  # Local dev secrets (gitignored)
├── .env.production         # Production settings
└── .gitignore
```

```gitignore
.env.local
.env.*.local
```

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.
