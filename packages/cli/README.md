# @rcompat/cli

CLI tools for terminal colors, formatting, and interactive prompts.

## What is @rcompat/cli?

A cross-runtime module providing terminal styling, output formatting, and
interactive prompts. Build beautiful command-line interfaces that work
consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/cli
```

```bash
pnpm add @rcompat/cli
```

```bash
yarn add @rcompat/cli
```

```bash
bun add @rcompat/cli
```

## Usage

### Colors

Style terminal output with ANSI colors.

```js
import red from "@rcompat/cli/color/red";
import green from "@rcompat/cli/color/green";
import blue from "@rcompat/cli/color/blue";
import bold from "@rcompat/cli/color/bold";
import dim from "@rcompat/cli/color/dim";

console.log(red("Error: something went wrong"));
console.log(green("Success!"));
console.log(blue("Info: processing..."));
console.log(bold("Important message"));
console.log(dim("Less important"));

// Combine styles
console.log(bold(red("Critical error!")));
```

Available colors:
- `red`, `green`, `blue`, `cyan`, `magenta`, `yellow`
- `black`, `white`, `gray` (alias: `grey`)
- `bold`, `dim`, `inverse`

### print

Write to stdout without a newline.

```js
import print from "@rcompat/cli/print";

print("Loading");
print(".", ".", ".");  // Multiple arguments joined with space
print("\n");
```

### mark

Format strings with placeholders and dim styling.

```js
import mark from "@rcompat/cli/mark";

console.log(mark("Created {0} in {1}", "config.json", "./src"));
// Output: Created config.json in ./src (values dimmed)

console.log(mark("Found {0} files", 42));
// Output: Found 42 files
```

### Prompts

Interactive CLI prompts for user input.

#### text

```js
import text from "@rcompat/cli/prompts/text";
import isCancel from "@rcompat/cli/prompts/is-cancel";

const name = await text({
  message: "What is your name?",
  initial: "Anonymous",
  validate: (value) => {
    if (value.length < 2) return "Name must be at least 2 characters";
  },
});

if (isCancel(name)) {
  console.log("Cancelled");
  process.exit(0);
}

console.log(`Hello, ${name}!`);
```

#### confirm

```js
import confirm from "@rcompat/cli/prompts/confirm";
import isCancel from "@rcompat/cli/prompts/is-cancel";

const proceed = await confirm({
  message: "Do you want to continue?",
  initial: true,  // default to yes
});

if (isCancel(proceed)) {
  console.log("Cancelled");
  process.exit(0);
}

if (proceed) {
  console.log("Continuing...");
}
```

#### select

```js
import select from "@rcompat/cli/prompts/select";

const color = await select({
  message: "Pick a color",
  options: [
    { label: "Red", value: "#ff0000" },
    { label: "Green", value: "#00ff00" },
    { label: "Blue", value: "#0000ff" },
  ],
  initial: 0,  // default to first option
});

console.log(`You picked: ${color}`);
```

#### multiselect

```js
import multiselect from "@rcompat/cli/prompts/multiselect";

const features = await multiselect({
  message: "Select features to install",
  options: [
    { label: "TypeScript", value: "typescript" },
    { label: "ESLint", value: "eslint" },
    { label: "Prettier", value: "prettier" },
    { label: "Testing", value: "testing" },
  ],
  initial: [0, 1],  // pre-select first two
});

console.log(`Installing: ${features.join(", ")}`);
```

#### spinner

```js
import spinner from "@rcompat/cli/prompts/spinner";

const s = spinner();

s.start("Installing dependencies");

// Update message while running
s.message("Still installing...");

// Simulate async work
await new Promise(r => setTimeout(r, 2000));

s.stop("Dependencies installed");
```

#### intro / outro

```js
import intro from "@rcompat/cli/prompts/intro";
import outro from "@rcompat/cli/prompts/outro";

intro("Welcome to the setup wizard");

// ... your prompts here ...

outro("Setup complete!");
```

#### cancel

Handle user cancellation (Ctrl+C).

```js
import text from "@rcompat/cli/prompts/text";
import isCancel from "@rcompat/cli/prompts/is-cancel";
import cancel from "@rcompat/cli/prompts/cancel";

const name = await text({ message: "Your name?" });

if (isCancel(name)) {
  cancel("Operation cancelled");
  process.exit(0);
}
```

## API Reference

### Colors

```ts
import color from "@rcompat/cli/color/<name>";
declare function color(message: string): string;
```

| Color     | Import Path                    | ANSI Code |
|-----------|--------------------------------|-----------|
| `black`   | `@rcompat/cli/color/black`     | 30        |
| `red`     | `@rcompat/cli/color/red`       | 31        |
| `green`   | `@rcompat/cli/color/green`     | 32        |
| `yellow`  | `@rcompat/cli/color/yellow`    | 33        |
| `blue`    | `@rcompat/cli/color/blue`      | 34        |
| `magenta` | `@rcompat/cli/color/magenta`   | 35        |
| `cyan`    | `@rcompat/cli/color/cyan`      | 36        |
| `white`   | `@rcompat/cli/color/white`     | 37        |
| `gray`    | `@rcompat/cli/color/gray`      | 90        |
| `grey`    | `@rcompat/cli/color/grey`      | 90        |
| `bold`    | `@rcompat/cli/color/bold`      | 1         |
| `dim`     | `@rcompat/cli/color/dim`       | 2         |
| `inverse` | `@rcompat/cli/color/inverse`   | 7         |

### print

```ts
declare function print(...messages: string[]): void;
```

Writes messages to stdout, joined by spaces, without a trailing newline.

### mark

```ts
declare function mark(format: string, ...params: unknown[]): string;
```

Formats a string by replacing `{0}`, `{1}`, etc. with dimmed parameter values.

### Prompts

#### text

```ts
declare function text(options: TextOptions): Promise<string | CancelSymbol>;

interface TextOptions {
  message: string;
  initial?: string;
  validate?: (input: string) => string | void | Promise<string | void>;
}
```

#### confirm

```ts
declare function confirm(options: ConfirmOptions): Promise<boolean | CancelSymbol>;

interface ConfirmOptions {
  message: string;
  initial?: boolean;
}
```

#### select

```ts
declare function select<T>(options: SelectOptions<T>): Promise<T>;

interface SelectOptions<T> {
  message: string;
  options: Array<{ label: string; value: T }>;
  initial?: number;
}
```

#### multiselect

```ts
declare function multiselect<T>(options: MultiselectOptions<T>): Promise<T[]>;

interface MultiselectOptions<T> {
  message: string;
  options: Array<{ label: string; value: T }>;
  initial?: number[];
}
```

#### spinner

```ts
declare function spinner(): {
  start(message: string): void;
  message(text: string): void;
  stop(message?: string): void;
};
```

#### intro / outro / cancel

```ts
declare function intro(message?: string): void;
declare function outro(message?: string): void;
declare function cancel(message?: string): CancelSymbol;
```

#### isCancel

```ts
declare function isCancel(value: unknown): value is CancelSymbol;
```

## Examples

### Interactive CLI wizard

```js
import intro from "@rcompat/cli/prompts/intro";
import outro from "@rcompat/cli/prompts/outro";
import text from "@rcompat/cli/prompts/text";
import select from "@rcompat/cli/prompts/select";
import confirm from "@rcompat/cli/prompts/confirm";
import spinner from "@rcompat/cli/prompts/spinner";
import isCancel from "@rcompat/cli/prompts/is-cancel";
import cancel from "@rcompat/cli/prompts/cancel";
import green from "@rcompat/cli/color/green";

intro("Project Setup");

const name = await text({
  message: "Project name?",
  initial: "my-app",
});
if (isCancel(name)) {
  cancel("Setup cancelled");
  process.exit(0);
}

const template = await select({
  message: "Select a template",
  options: [
    { label: "Minimal", value: "minimal" },
    { label: "Full", value: "full" },
  ],
});

const install = await confirm({
  message: "Install dependencies?",
  initial: true,
});

if (install) {
  const s = spinner();
  s.start("Installing dependencies");
  await new Promise(r => setTimeout(r, 2000));
  s.stop("Dependencies installed");
}

outro(green(`Created ${name} with ${template} template`));
```

### Colored log levels

```js
import red from "@rcompat/cli/color/red";
import yellow from "@rcompat/cli/color/yellow";
import blue from "@rcompat/cli/color/blue";
import dim from "@rcompat/cli/color/dim";

const log = {
  error: (msg) => console.log(red("ERROR"), msg),
  warn: (msg) => console.log(yellow("WARN"), msg),
  info: (msg) => console.log(blue("INFO"), msg),
  debug: (msg) => console.log(dim("DEBUG"), dim(msg)),
};

log.error("Connection failed");
log.warn("Deprecated API");
log.info("Server started");
log.debug("Request received");
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

