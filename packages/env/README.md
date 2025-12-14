# @rcompat/env

Environment variable loading for JavaScript runtimes.

## What is @rcompat/env?

A cross-runtime module for loading environment variables from `.env` files with
automatic environment detection. Supports local overrides and works consistently
across Node, Deno, and Bun.

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

### Loading env files

The default export automatically loads environment variables from `.env` files
in your project root.

```js
import env from "@rcompat/env";

console.log(env.DATABASE_URL);
console.log(env.API_KEY);
```

### Environment-specific files

Set the `JS_ENV` environment variable to load environment-specific files:

```bash
# Load .env.development
JS_ENV=development node app.js

# Load .env.production
JS_ENV=production node app.js
```

### File precedence

The package looks for files in this order (first match wins):

1. `.env.{JS_ENV}.local` (e.g., `.env.development.local`)
2. `.env.{JS_ENV}` (e.g., `.env.development`)
3. `.env.local`
4. `.env`

Local files (`.local` suffix) are typically gitignored and used for
machine-specific secrets.

### System environment variables

Use the `user` export to access system environment variables directly
(`process.env`).

```js
import user from "@rcompat/env/user";

console.log(user.HOME);      // /home/username
console.log(user.PATH);      // /usr/bin:/bin:...
console.log(user.NODE_ENV);  // development
```

## API Reference

### Default Export (env)

```ts
declare const env: Record<string, string>;
```

Parsed environment variables from the appropriate `.env` file. Returns an empty
object if no env file is found.

| Property | Type                     | Description                    |
|----------|--------------------------|--------------------------------|
| `env`    | `Record<string, string>` | Key-value pairs from .env file |

### user

```ts
declare const user: NodeJS.ProcessEnv;
```

Direct access to system environment variables (`process.env`).

| Property | Type                 | Description                  |
|----------|----------------------|------------------------------|
| `user`   | `NodeJS.ProcessEnv`  | System environment variables |

## Examples

### Database configuration

```
# .env
DATABASE_URL=postgres://localhost:5432/mydb
DATABASE_POOL_SIZE=10
```

```js
import env from "@rcompat/env";

const db = createPool({
  connectionString: env.DATABASE_URL,
  max: Number(env.DATABASE_POOL_SIZE) || 5,
});
```

### Environment-specific configuration

```
# .env.development
API_URL=http://localhost:3000
DEBUG=true

# .env.production
API_URL=https://api.example.com
DEBUG=false
```

```js
import env from "@rcompat/env";

const config = {
  apiUrl: env.API_URL,
  debug: env.DEBUG === "true",
};
```

### Combining env files with system env

```js
import env from "@rcompat/env";
import user from "@rcompat/env/user";

// From .env file
const apiKey = env.API_KEY;

// From system environment
const home = user.HOME;
const ci = user.CI === "true";
```

### Local overrides for development

```
# .env.development
DATABASE_URL=postgres://prod-db:5432/mydb

# .env.development.local (gitignored)
DATABASE_URL=postgres://localhost:5432/mydb_dev
```

```js
import env from "@rcompat/env";

// In development, uses localhost from .local file
// On CI/production, uses the regular .env.development
console.log(env.DATABASE_URL);
```

### Typical project structure

```
my-project/
├── .env                    # Shared defaults
├── .env.development        # Development settings
├── .env.development.local  # Local dev secrets (gitignored)
├── .env.production         # Production settings
├── .gitignore              # Include *.local
└── src/
    └── config.js
```

```gitignore
# .gitignore
.env.local
.env.*.local
```

## Cross-Runtime Compatibility

| Runtime | Supported |
|---------|-----------|
| Node.js | ✓         |
| Deno    | ✓         |
| Bun     | ✓         |

No configuration required — just import and use.

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the repository root.

