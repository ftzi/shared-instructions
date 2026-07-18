# dotenvx

Encrypted `.env` files committed to git. Private keys stored outside the repo.

## Setup

```bash
npm install --save-dev @dotenvx/dotenvx
```

## Files

| File               | Purpose                 | Committed?      |
| ------------------ | ----------------------- | --------------- |
| `.env.development` | Development secrets     | Yes (encrypted) |
| `.env.production`  | Production secrets      | Yes (encrypted) |
| `.env.keys`        | Private decryption keys | **Never**       |

## Encrypt

```bash
npx dotenvx encrypt -f .env.development
npx dotenvx encrypt -f .env.production
```

The encrypted files contain the public key in metadata (safe to commit). Private keys land in `.env.keys`.

## Private keys

Copy the private keys from `.env.keys`, then delete it:

```
DOTENV_PRIVATE_KEY_DEVELOPMENT=...   -> store locally (Keychain, password manager, etc.)
DOTENV_PRIVATE_KEY_PRODUCTION=...    -> set as GitHub Secret for CI
```

## Local dev

`dotenvx run` auto-loads the matching encrypted file based on the private key suffix:

```bash
# DOTENV_PRIVATE_KEY_DEVELOPMENT in env -> auto-loads .env.development
dotenvx run -- your-command
```

Add to `package.json`:

```json
"dev": "dotenvx run -- your-command"
```

## CI

```yaml
- run: dotenvx run -f .env.development --strict -- your-command
  env:
    DOTENV_PRIVATE_KEY_DEVELOPMENT: ${{ secrets.DOTENV_PRIVATE_KEY_DEVELOPMENT }}
```

`--strict` fails fast if decryption fails rather than silently passing empty values.

## Set individual values

```bash
npx dotenvx set KEY value -f .env.development
npx dotenvx set KEY value -f .env.production
```

This updates the encrypted file directly without needing the private key (the public key in the file metadata is sufficient).

## Adding a new env var

1. `npx dotenvx set NEW_KEY value -f .env.development`
2. `npx dotenvx set NEW_KEY value -f .env.production`
3. Commit the updated files.

## Rotating keys

```bash
rm .env.development .env.production .env.keys
# recreate plaintext files with values
npx dotenvx encrypt -f .env.development
npx dotenvx encrypt -f .env.production
# store new private keys, update GitHub Secret
```
