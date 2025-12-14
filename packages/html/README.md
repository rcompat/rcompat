# @rcompat/html

HTML utilities for JavaScript runtimes.

## What is @rcompat/html?

A cross-runtime module providing HTML handling utilities, including escaping
for XSS prevention. Works consistently across Node, Deno, and Bun.

## Installation

```bash
npm install @rcompat/html
```

```bash
pnpm add @rcompat/html
```

```bash
yarn add @rcompat/html
```

```bash
bun add @rcompat/html
```

## Usage

### escape

Escapes HTML special characters to prevent Cross-Site Scripting (XSS) attacks.
Based on [OWASP recommendations](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding-for-html-contexts).

```js
import escape from "@rcompat/html/escape";

escape("<script>alert('xss')</script>");
// "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"

escape('Hello "world"');
// "Hello &quot;world&quot;"

escape("Tom & Jerry");
// "Tom &amp; Jerry"
```

### Character escaping

| Character | Escaped    |
|-----------|------------|
| `&`       | `&amp;`    |
| `<`       | `&lt;`     |
| `>`       | `&gt;`     |
| `"`       | `&quot;`   |
| `'`       | `&#x27;`   |

## API Reference

### `escape(input)`

```ts
declare function escape(input: string): string;
```

Escapes HTML special characters in a string.

| Parameter | Type     | Description              |
|-----------|----------|--------------------------|
| `input`   | `string` | The string to escape     |

**Returns**: The escaped string safe for HTML insertion.

## Examples

### Safe HTML templates

```js
import escape from "@rcompat/html/escape";

function renderUser(user) {
  return `
    <div class="user">
      <h2>${escape(user.name)}</h2>
      <p>${escape(user.bio)}</p>
    </div>
  `;
}

renderUser({ name: "<script>bad</script>", bio: "I'm a user" });
// <div class="user">
//   <h2>&lt;script&gt;bad&lt;/script&gt;</h2>
//   <p>I&#x27;m a user</p>
// </div>
```

### Escaping attribute values

```js
import escape from "@rcompat/html/escape";

function createLink(url, text) {
  return `<a href="${escape(url)}" title="${escape(text)}">${escape(text)}</a>`;
}

createLink("/search?q=a&b=c", 'Search "results"');
// <a href="/search?q=a&amp;b=c" title="Search &quot;results&quot;">Search &quot;results&quot;</a>
```

### Form input display

```js
import escape from "@rcompat/html/escape";

function displayComment(comment) {
  return `<div class="comment">${escape(comment.text)}</div>`;
}

// Malicious input is safely escaped
displayComment({ text: "<img src=x onerror=alert(1)>" });
// <div class="comment">&lt;img src=x onerror=alert(1)&gt;</div>
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

