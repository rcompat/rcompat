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
```js
import env from "@rcompat/env";

console.log(env.DATABASE_URL);
console.log(env.HOME); // from process.env
```

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
BAR=hello$FOO       # helloworld
BAZ=hello${FOO}     # helloworld
ESCAPED=hello\$FOO  # hello$FOO
```

Substitution resolves against the merged environment, so `process.env` variables
are available too:
```
CONFIG=$HOME/.config/myapp
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
