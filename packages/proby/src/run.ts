import assert from "@rcompat/assert";
import cli from "@rcompat/cli";
import type { FileRef } from "@rcompat/fs";
import fs from "@rcompat/fs";
import is from "@rcompat/is";
import type { Env } from "@rcompat/test";
import repository from "@rcompat/test/repository";
import type { MaybePromise } from "@rcompat/type";

const extensions = [".spec.ts", ".spec.js"];

const base_scalars = ["boolean", "number", "string", "symbol"];

function stringify_scalar(x: unknown) {
  if (is.null(x)) return "null";
  if (is.undefined(x)) return "undefined";

  const type = typeof x;
  if (base_scalars.includes(type)) return x.toString();
  if (is.bigint(x)) return x.toString() + "n";
  if (is.function(x)) {
    return `[Function${is.text(x.name) ? `: ${x.name}` : ""}]`;
  }
}

function stringify(x: unknown) {
  const scalar = stringify_scalar(x);
  if (is.defined(scalar)) return scalar;
  if (is.object(x)) {
    try {
      return JSON.stringify(x, (_, sub) => {
        const s = stringify_scalar(sub);
        return is.defined(s) ? s : sub;
      });
    } catch {
      return "[Object (circular or unserializable)]";
    }
  }

  return String(x);
}

function format_duration(ms: number) {
  return `[${ms.toFixed(2)}ms]`;
}

function format_ms(ms: number) {
  return `${ms.toFixed(2)}ms`;
}

type CapturedOutput = {
  stream: "stdout" | "stderr";
  text: string;
};

type SuiteTest = {
  name: string;
  group?: string;
  duration: number;
  output: CapturedOutput[];
  results: {
    passed: boolean;
    expected: unknown;
    actual: unknown;
  }[];
};

function print_captured_output(output: CapturedOutput[], indent: string = "") {
  for (const entry of output) {
    const label = entry.stream === "stdout" ? "Log" : "Error";
    const lines = entry.text.split("\n").filter(line => line.length > 0);

    if (lines.length > 0) cli.print("\n");

    for (const line of lines) cli.print(`${indent}${label}: ${line}\n`);
  }
}

function print_expected_actual(expected: unknown, actual: unknown) {
  const expected_beginning = cli.fg.dim("Expected");
  const expected_end = cli.fg.dim(stringify(expected));
  const actual_beginning = cli.fg.red("Actual");
  const actual_end = cli.fg.red(stringify(actual));

  cli.print(`${expected_beginning}   ${expected_end}\n`);
  cli.print(`${actual_beginning}     ${actual_end}\n`);
}

// Patches process.stdout/stderr and console.* to buffer output, runs the
// async iterator's next step, then restores. This lets us attribute each
// test's console output to that test rather than letting it leak to the top.
async function next_test_with_std_output<T>(
  iter: AsyncIterator<T>,
): Promise<{ done: boolean; value: T | undefined; output: CapturedOutput[] }> {
  const output: CapturedOutput[] = [];

  const orig_stdout = process.stdout.write.bind(process.stdout);
  const orig_stderr = process.stderr.write.bind(process.stderr);
  const orig_log = console.log;
  const orig_info = console.info;
  const orig_warn = console.warn;
  const orig_error = console.error;

  const push = (stream: "stdout" | "stderr", args: unknown[]) => {
    output.push({ stream, text: args.map(String).join(" ") });
  };

  (process.stdout.write as unknown) = (chunk: unknown) => {
    push("stdout", [chunk]); return true;
  };
  (process.stderr.write as unknown) = (chunk: unknown) => {
    push("stderr", [chunk]); return true;
  };
  console.log = (...args) => push("stdout", args);
  console.info = (...args) => push("stdout", args);
  console.warn = (...args) => push("stderr", args);
  console.error = (...args) => push("stderr", args);

  let result: IteratorResult<T>;
  try {
    result = await iter.next();
  } finally {
    process.stdout.write = orig_stdout;
    process.stderr.write = orig_stderr;
    console.log = orig_log;
    console.info = orig_info;
    console.warn = orig_warn;
    console.error = orig_error;
  }

  return { done: result.done ?? false, value: result.value, output };
}

const INDENT = "  "; // two spaces per nesting level

function indent_at(depth: number) {
  return INDENT.repeat(depth);
}

// 0 = quiet, 1 = verbose, 2 = very verbose
export type VerbosityLevel = 0 | 1 | 2;

const grand_totals = {
  passed: 0,
  failed: 0,
  duration: 0,
};

let summary_printed = false;

export function reset_totals() {
  grand_totals.passed = 0;
  grand_totals.failed = 0;
  grand_totals.duration = 0;
  summary_printed = false;
}

function print_totals_line(passed: number, failed: number, duration: number) {
  const passed_color = failed > 0 ? cli.fg.dim : cli.fg.green;
  const failed_color = failed > 0 ? cli.fg.red : cli.fg.dim;

  const passed_text = passed_color(passed + " pass");
  const failed_text = failed_color(failed + " fail");
  const dim = cli.fg.dim;
  const duration_text = dim(format_ms(duration));
  const dim_comma = dim(",");
  const passed_with_comma = `${passed_text}${dim_comma}`;
  const failed_with_comma = `${failed_text}${dim_comma}`;
  const passed_and_failed = `${passed_with_comma} ${failed_with_comma}`;

  cli.print(
    `${dim("[")}${passed_and_failed} ${duration_text}${dim("]")}`,
  );
}

// Used for the per-file summary line at plain verbose (-v) level, where we
// only want to show timing, not pass/fail counts (those are already
// visible in the package/summary totals).
function print_duration_only(duration: number) {
  const dim = cli.fg.dim;
  cli.print(`${dim("[")}${dim(format_ms(duration))}${dim("]")}`);
}

// only the first call actually prints anything.
export function print_summary() {
  if (summary_printed) return;
  if (grand_totals.passed + grand_totals.failed === 0) return;
  summary_printed = true;

  cli.print("\n");

  const passed_color = grand_totals.failed > 0 ? cli.fg.dim : cli.fg.green;
  const failed_color = grand_totals.failed > 0 ? cli.fg.red : cli.fg.dim;
  const total_color = grand_totals.failed > 0 ? cli.bg.red : cli.bg.green;
  const formatted_duration = format_ms(grand_totals.duration);

  const total_text = total_color(" SUMMARY ");
  const passed = passed_color("Passed: " + grand_totals.passed);
  const failed = failed_color("Failed: " + grand_totals.failed);
  const duration = cli.fg.dim("Duration: " + formatted_duration);

  cli.print(
    `${total_text}\n${passed}\n${failed}\n${duration}\n`,
  );
  cli.print("\n");
  cli.print("\n");
}

// Guarantees the grand total is printed exactly once, after every subrepo
// has been processed, with no dependency on the caller remembering to call
// print_summary() itself.
process.on("exit", () => {
  print_summary();
});

type GroupNode = {
  name: string;
  tests: SuiteTest[];
  children: GroupNode[];
};

type RootItem =
  | { kind: "group"; node: GroupNode }
  | { kind: "test"; test: SuiteTest }
  ;

type FileResult = {
  file: FileRef;
  passed: number;
  failed: number;
  duration: number;
  items: RootItem[];
};

function group_failed(node: GroupNode): boolean {
  return node.tests.some(t => t.results.some(r => !r.passed))
    || node.children.some(group_failed);
}

async function process_file(
  file: FileRef,
  group?: string,
): Promise<FileResult> {
  const result: FileResult = {
    file,
    passed: 0,
    failed: 0,
    duration: 0,
    items: [],
  };

  const env_file = await file.sibling(
    file.name.replace(/\.spec\.(ts|js)$/, ".env.ts"),
  ).or(() => null);

  const mock_file = await file.sibling(
    file.name.replace(/\.spec\.(ts|js)$/, ".mock.$1"),
  ).or(() => null);

  let env_module: Env | undefined;

  if (!is.null(env_file)) {
    env_module = assert.shape<Env>((await import(env_file.path)).default, {
      globals: "function",
      setup: "function?",
      teardown: "function?",
    });
  }

  repository.suite(file);

  const suite = repository.next().next().value!;

  // Captured inside the try (where `context` is inferred from setup),
  // invoked from finally so cleanup runs even when suite iteration throws.
  let cleanup: (() => MaybePromise<void>) | undefined;

  try {
    if (!is.null(mock_file)) await mock_file.import();
    await file.import();

    const context = await env_module?.setup?.();

    // Apply the env's globals to globalThis for the duration of this suite,
    // then restore the previous values afterwards. This replaces the free
    // process-level isolation the old per-spec worker provided; in-process,
    // all spec files share one globalThis, so without restore the globals
    // would leak into subsequent spec files (order-dependent failures).
    const globals = env_module?.globals(context);
    const applied_globals = is.defined(globals)
      ? Object.keys(globals).map(k =>
        [k, (globalThis as Record<string, unknown>)[k]] as const)
      : undefined;
    if (is.defined(globals)) {
      Object.assign(globalThis, globals);
    }

    cleanup = async () => {
      if (is.defined(applied_globals)) {
        for (const [k, v] of applied_globals) {
          if (v === undefined) {
            delete (globalThis as Record<string, unknown>)[k];
          } else {
            (globalThis as Record<string, unknown>)[k] = v;
          }
        }
      }
      await env_module?.teardown?.(context);
    };

    // Each entry tracks a group name, its own tests, and any child groups
    // that were flushed into it from the stack below.
    const stack: GroupNode[] = [];

    function flush_top() {
      const node = stack.pop()!;
      if (stack.length > 0) {
        // Attach this node as a child of the new top.
        stack.at(-1)!.children.push(node);
      } else {
        // Root group — record it in arrival order.
        result.items.push({ kind: "group", node });
      }
    }

    const iter = suite.run()[Symbol.asyncIterator]();

    let done_iterating = false;

    while (is.falsy(done_iterating)) {
      const { done, value, output } = await next_test_with_std_output(iter);

      done_iterating = is.truthy(done) || !is.defined(value);
      if (done_iterating) break;

      const { test, duration } = value!;

      if (is.defined(group) && test.group !== group) continue;

      const test_entry: SuiteTest = {
        name: test.name,
        group: test.group,
        duration,
        output,
        results: test.results,
      };

      // Counted per test.case, not per assert — a test.case with several
      // asserts still contributes exactly one pass or one fail.
      const test_failed = test_entry.results.some(r => !r.passed);
      if (test_failed) {
        result.failed++;
      } else {
        result.passed++;
      }
      result.duration += duration;

      if (is.defined(test.group)) {
        if (stack.length === 0 || stack.at(-1)!.name !== test.group) {
          stack.push({ name: test.group, tests: [], children: [] });
        }
        stack.at(-1)!.tests.push(test_entry);
        continue;
      }

      // Ungrouped test — flush everything on the stack first, to preserve
      // arrival order relative to any group that came before it.
      while (stack.length > 0) {
        flush_top();
      }

      result.items.push({ kind: "test", test: test_entry });
    }

    // Flush any remaining groups at end of file.
    while (stack.length > 0) {
      flush_top();
    }
  } finally {
    // Restore any globals we applied, then tear down the env context.
    // Runs even when suite iteration throws, so globals never leak across
    // spec files and teardown always pairs with setup. `repository.reset()`
    // is nested so a throwing teardown can't skip it.
    try {
      try {
        await suite.end();
      } finally {
        await cleanup?.();
      }
    } finally {
      repository.reset();
    }
  }

  return result;
}

function print_group(node: GroupNode, depth: number, show_all: boolean) {
  const failed = group_failed(node);

  const is_passing_entire_group = !show_all && !failed;
  if (is_passing_entire_group) return;

  const group_indent = indent_at(depth + 1);
  const test_indent = indent_at(depth + 2);

  const icon = failed ? cli.fg.red("✗") : cli.fg.green("✓");
  const total_duration =
    node.tests.reduce((n, t) => n + t.duration, 0) +
    node.children.reduce((n, c) =>
      n + c.tests.reduce((m, t) => m + t.duration, 0), 0);
  const group_label = cli.fg.dim(node.name);
  const group_time = cli.fg.dim(format_duration(total_duration));
  const group_label_after_check = failed
    ? `${group_label} ${group_time}`
    : `${cli.fg.dim(group_label)} ${group_time}`;

  cli.print(
    `${group_indent}${icon} ${group_label_after_check}\n`,
  );

  // Print tests that belong to this group come first (before any child
  // group), then child groups are printed at depth+1. Each test.case is
  // printed as a single line, regardless of how many asserts it contains.
  for (const test of node.tests) {
    const time = format_duration(test.duration);
    const test_failed = test.results.some(r => !r.passed);

    if (test_failed) {
      const beginning = `${test_indent}${cli.fg.red("✗")}`;

      cli.print(`${beginning} ${test.name} ${cli.fg.dim(time)}\n`);

      print_captured_output(test.output);

      cli.print("\n");

      for (const r of test.results) {
        if (!r.passed) {
          print_expected_actual(r.expected, r.actual);
          cli.print("\n");
        }
      }
    } else {
      if (!show_all) continue; // hide passing lines unless very verbose

      const beginning = `${test_indent}${cli.fg.green("✓")}`;
      cli.print(`${beginning} ${cli.fg.dim(`${test.name} ${time}\n`)}`);
    }
  }

  for (const child of node.children) {
    if (!show_all && !group_failed(child)) continue;
    print_group(child, depth + 1, show_all);
  }
}

function print_ungrouped_test(test: SuiteTest, show_all: boolean) {
  const time = format_duration(test.duration);
  const test_failed = test.results.some(r => !r.passed);

  if (!show_all && !test_failed) return;

  if (test_failed) {
    cli.print(`  ${cli.fg.red("✗")} ${test.name} ${time}\n`);

    print_captured_output(test.output, INDENT);

    cli.print("\n");

    for (const r of test.results) {
      if (!r.passed) {
        print_expected_actual(r.expected, r.actual);
        cli.print("\n");
      }
    }
  } else {
    const test_name_and_time = cli.fg.dim(test.name + " " + time);
    cli.print(`  ${cli.fg.green("✓")} ${test_name_and_time}\n`);
  }
}

function render_file_items(items: RootItem[], show_all: boolean) {
  for (const item of items) {
    if (item.kind === "group") print_group(item.node, 0, show_all);
    else print_ungrouped_test(item.test, show_all);
  }
}

export default async (
  root: FileRef,
  subrepo?: string,
  target?: string,
  group?: string,
  verbose: VerbosityLevel = 0,
) => {
  const show_all = verbose >= 2;

  const resolved = is.defined(target) ? fs.resolve(target).path : undefined;

  const files = await root.list({
    recursive: true,
    filter: info => {
      const path = info.path;

      if (is.undefined(resolved)) {
        return extensions.some(e => path.endsWith(e));
      }

      if (extensions.some(e => resolved.endsWith(e))) {
        return path.endsWith(resolved);
      }

      return info.path.startsWith(resolved) &&
        extensions.some(e => path.endsWith(e));
    },
  });

  if (files.length === 0) return;

  // Phase 1: run every file's tests and collect results — nothing is
  // printed yet, so we can know each file's (and the subrepo's) totals
  // before printing anything for it.
  const file_results: FileResult[] = [];
  for (const file of files) {
    file_results.push(await process_file(file, group));
  }

  const subrepo_passed = file_results.reduce((n, f) => n + f.passed, 0);
  const subrepo_failed = file_results.reduce((n, f) => n + f.failed, 0);
  const subrepo_duration = file_results.reduce((n, f) => n + f.duration, 0);

  grand_totals.passed += subrepo_passed;
  grand_totals.failed += subrepo_failed;
  grand_totals.duration += subrepo_duration;

  // Phase 2: render. Subrepo header + totals only apply when this call is
  // actually part of a monorepo (i.e. `subrepo` was passed in) — otherwise
  // it would just repeat the grand total.
  const show_subrepo = is.defined(subrepo) &&
    (verbose >= 1 || subrepo_failed > 0);

  if (show_subrepo) {
    cli.print("\n");
    cli.print(`${cli.bg.blue(" PACKAGE ")} ${subrepo!} `);

    if (verbose >= 1) {
      print_totals_line(subrepo_passed, subrepo_failed, subrepo_duration);
    }

    cli.print("\n\n");
  }

  for (const result of file_results) {
    const show_file = verbose >= 1 || result.failed > 0;
    if (!show_file) continue;

    cli.print(cli.fg.gray(`${result.file.debase(root)} `));

    // At plain verbose (-v) we only show timing on the file line — pass/
    // fail counts are already visible in the package/summary totals. At
    // very verbose (-vv) we show the full breakdown, since individual
    // test.case results are printed underneath.
    if (show_all) {
      print_totals_line(result.passed, result.failed, result.duration);
    } else if (verbose >= 1) {
      print_duration_only(result.duration);
    }

    cli.print("\n");
    render_file_items(result.items, show_all);
  }
};
