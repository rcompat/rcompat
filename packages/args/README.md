# @rcompat/args

Runtime-agnostic access to command-line arguments.

## What is @rcompat/args?

A cross-runtime module that provides consistent access to program arguments
across Node, Deno, and Bun. Write your CLI tools once and run them on any
JavaScript runtime.

## Installation

```bash
npm install @rcompat/args
```

## Usage

```js
import args from "@rcompat/args";

// args is a string[] containing your program arguments
console.log(args);
```

Running `node app.js foo bar --verbose` will output

```
[ 'foo', 'bar', '--verbose' ]
```

### Example: Simple CLI

```js
import args from "@rcompat/args";

const [command, ...rest] = args;

switch (command) {
    case "greet":
        console.log(`Hello, ${rest[0] ?? "world"}!`);
        break;

    case "help":
        console.log(
            `Usage:
  app.js <command> [args]

Commands:
  greet [name]   Greet the specified name (or 'world')
  help           Show this help message`
        );
        break;

    default:
        console.log("Usage: app.js <command> [args]");
}
```

```bash
node app.js greet Bob # Hello, Bob!
bun app.js greet      # Hello, world!
```

## How It Works

Different runtimes expose command-line arguments differently:

| Runtime | Source         | Includes runtime/script? |
| ------- | -------------- | ------------------------ |
| Node    | `process.argv` | Yes (first two elements) |
| Bun     | `Bun.argv`     | Yes (first two elements) |
| Deno    | `Deno.args`    | No                       |

`@rcompat/args` normalizes this by always returning only your program's
arguments — the runtime executable and script path are stripped away.

The package uses [runtime keys](https://runtime-keys.proposal.wintercg.org) to
select the appropriate implementation at import time, with zero runtime
overhead.

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
