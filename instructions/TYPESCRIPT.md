# TypeScript Standards

## TypeScript

- **NEVER** use `any`, `as any`, or `catch (error: any)`.
- **NEVER** use `interface`. Use `type` exclusively.
- Always use arrow functions.
- Prefer optional chaining for callbacks: `onComplete?.(data)`.
- Object params over positional: `function foo({ name }: { name: string })`.
- MUST reuse existing types and schemas if any, and derive types from them instead of repeating what they already have.
- Use `$inferSelect` / `$inferInsert` from Drizzle for database types.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers — extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

## Imports

- **NEVER use barrel files** (`index.ts` re-exports). Import directly from source files.
- **NEVER use dynamic imports** unless genuine code splitting.

## Async & Promises

- Always `await` promises in async functions — don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

## Error Handling

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully — don't catch errors just to rethrow them

## Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)

## Testing

- Tests are REQUIRED when adding/modifying endpoints, server functions, utilities, or business logic.
- Tests colocate as `*.test.ts` at the package root.
- Use `async/await`. Isolate test data (unique IDs/emails per test). Clean up in `afterAll`/`afterEach`.
- NEVER use `.only` or `.skip` in committed code.
- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests — use async/await instead
- Keep test suites reasonably flat — avoid excessive `describe` nesting
