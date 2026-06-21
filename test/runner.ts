type TestFn = () => void | Promise<void>;

declare const process: { exit(code: number): void } | undefined;

interface Suite {
  name: string;
  tests: Array<{ name: string; fn: TestFn }>;
  children: Suite[];
}

let rootSuite: Suite = { name: '', tests: [], children: [] };
let currentSuite: Suite = rootSuite;
let passed = 0;
let failed = 0;
let failures: Array<{ name: string; error: Error }> = [];

const color = (code: number, text: string): string => `\x1b[${code}m${text}\x1b[0m`;
const green = (t: string) => color(32, t);
const red = (t: string) => color(31, t);
const dim = (t: string) => color(90, t);
const bold = (t: string) => color(1, t);

export function describe(name: string, fn: () => void): void {
  const suite: Suite = { name, tests: [], children: [] };
  const parent = currentSuite;
  parent.children.push(suite);
  currentSuite = suite;
  fn();
  currentSuite = parent;
}

export function it(name: string, fn: TestFn): void {
  currentSuite.tests.push({ name, fn });
}

export const test = it;

class Expectation<T> {
  constructor(private value: T, private invert = false) {}

  private check(cond: boolean, passMsg: string, failMsg: string): void {
    const ok = this.invert ? !cond : cond;
    if (!ok) throw new Error(this.invert ? passMsg : failMsg);
  }

  get not(): Expectation<T> {
    return new Expectation(this.value, !this.invert);
  }

  toBe(expected: T): void {
    this.check(
      Object.is(this.value, expected),
      `expected value not to be ${JSON.stringify(expected)}`,
      `expected ${JSON.stringify(this.value)} to be ${JSON.stringify(expected)}`,
    );
  }

  toEqual(expected: T): void {
    const a = JSON.stringify(this.value);
    const b = JSON.stringify(expected);
    this.check(
      a === b,
      `expected value not to deeply equal ${b}`,
      `expected ${a} to deeply equal ${b}`,
    );
  }

  toBeTruthy(): void {
    this.check(
      Boolean(this.value),
      `expected value to be falsy`,
      `expected ${JSON.stringify(this.value)} to be truthy`,
    );
  }

  toBeFalsy(): void {
    this.check(
      !Boolean(this.value),
      `expected value to be truthy`,
      `expected ${JSON.stringify(this.value)} to be falsy`,
    );
  }

  toBeGreaterThan(n: number): void {
    const v = this.value as unknown as number;
    this.check(
      v > n,
      `expected ${v} not to be greater than ${n}`,
      `expected ${v} to be greater than ${n}`,
    );
  }

  toBeLessThan(n: number): void {
    const v = this.value as unknown as number;
    this.check(
      v < n,
      `expected ${v} not to be less than ${n}`,
      `expected ${v} to be less than ${n}`,
    );
  }

  toBeGreaterThanOrEqual(n: number): void {
    const v = this.value as unknown as number;
    this.check(
      v >= n,
      `expected ${v} to be less than ${n}`,
      `expected ${v} to be greater than or equal to ${n}`,
    );
  }

  toBeLessThanOrEqual(n: number): void {
    const v = this.value as unknown as number;
    this.check(
      v <= n,
      `expected ${v} to be greater than ${n}`,
      `expected ${v} to be less than or equal to ${n}`,
    );
  }

  toMatch(re: RegExp): void {
    const v = String(this.value);
    this.check(
      re.test(v),
      `expected "${v}" not to match ${re}`,
      `expected "${v}" to match ${re}`,
    );
  }

  toContain(item: unknown): void {
    const v = this.value as unknown as Array<unknown> | string;
    const ok = Array.isArray(v)
      ? v.includes(item)
      : typeof v === 'string' && typeof item === 'string'
        ? v.includes(item)
        : false;
    this.check(
      ok,
      `expected value not to contain ${JSON.stringify(item)}`,
      `expected ${JSON.stringify(this.value)} to contain ${JSON.stringify(item)}`,
    );
  }

  toHaveLength(n: number): void {
    const v = this.value as unknown as { length: number };
    this.check(
      v.length === n,
      `expected length not to be ${n}`,
      `expected length ${v.length} to be ${n}`,
    );
  }

  toBeInstanceOf(ctor: Function): void {
    this.check(
      this.value instanceof ctor,
      `expected value not to be instance of ${ctor.name}`,
      `expected value to be instance of ${ctor.name}`,
    );
  }
}

export function expect<T>(value: T): Expectation<T> {
  return new Expectation(value);
}

async function runSuite(suite: Suite, depth = 0): Promise<void> {
  const prefix = '  '.repeat(depth);
  if (suite.name) {
    console.log(`${prefix}${bold(suite.name)}`);
  }
  for (const t of suite.tests) {
    try {
      await t.fn();
      passed += 1;
      console.log(`${prefix}  ${green('✓')} ${dim(t.name)}`);
    } catch (err) {
      failed += 1;
      const error = err instanceof Error ? err : new Error(String(err));
      failures.push({ name: `${suite.name ? suite.name + ' > ' : ''}${t.name}`, error });
      console.log(`${prefix}  ${red('✗')} ${t.name}`);
    }
  }
  for (const child of suite.children) {
    await runSuite(child, depth + (suite.name ? 1 : 0));
  }
}

export async function run(): Promise<void> {
  const start = Date.now();
  await runSuite(rootSuite);
  const elapsed = Date.now() - start;

  console.log('');
  if (failed === 0) {
    console.log(green(bold(`  ✓ ${passed} test${passed !== 1 ? 's' : ''} passed`)) + dim(` (${elapsed}ms)`));
    if (typeof process !== 'undefined') process.exit(0);
  } else {
    console.log(red(bold(`  ✗ ${failed} test${failed !== 1 ? 's' : ''} failed`)) + dim(`, ${passed} passed (${elapsed}ms)`));
    console.log('');
    for (const [i, f] of failures.entries()) {
      console.log(`  ${red(`${i + 1})`)} ${bold(f.name)}`);
      const lines = f.error.stack?.split('\n') ?? [f.error.message];
      for (const line of lines) {
        console.log(`     ${dim(line)}`);
      }
      console.log('');
    }
    if (typeof process !== 'undefined') process.exit(1);
  }
}
