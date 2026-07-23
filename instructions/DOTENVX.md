# dotenvx

Encrypted `.env` files committed to git. Private keys stored outside the repo. Safe to share, review, and branch with.

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

Each env file is encrypted with its own key pair:

- `DOTENV_PUBLIC_KEY_DEVELOPMENT` / `DOTENV_PRIVATE_KEY_DEVELOPMENT`
- `DOTENV_PUBLIC_KEY_PRODUCTION` / `DOTENV_PRIVATE_KEY_PRODUCTION`

The public key is embedded in the encrypted file metadata (safe to commit). Private keys live in `.env.keys` (git-ignored, NEVER committed) and are stored as GitHub Secrets.

Encrypted values start with `encrypted:` and are safe to commit.

## Commands

```sh
# Set a value (encrypts automatically)
npx dotenvx set KEY value -f .env.development
npx dotenvx set KEY value -f .env.production

# Encrypt after manual plaintext edits
npx dotenvx encrypt -f .env.development
npx dotenvx encrypt -f .env.production

# Decrypt and read a single value
npx dotenvx get KEY -f .env.production

# Run a command with decrypted env loaded
# --strict fails if any value is plaintext/missing — guards against unencrypted secrets
npx dotenvx run -f .env.production --strict -- <command>
```

## Local dev

`dotenvx run` auto-loads the matching encrypted file based on the private key suffix:

```bash
# DOTENV_PRIVATE_KEY_DEVELOPMENT in env -> auto-loads .env.development
npx dotenvx run -- your-command
```

Or specify the file explicitly:

```bash
npx dotenvx run -f .env.development --strict -- your-command
```

## CI

- **PR / E2E workflows** load `.env.development` with `DOTENV_PRIVATE_KEY_DEVELOPMENT`.
- **Main-merge deploy workflows** load `.env.production` with `DOTENV_PRIVATE_KEY_PRODUCTION`.
- Use `dotenvx run --strict` to surface any unencrypted value as a hard failure.
- NEVER reference individual GitHub secrets (e.g. `secrets.API_KEY`) for app config in deploy/migrate steps. Load env from the encrypted file instead.
- Pure validation steps (lint, typecheck, test) generally need no secrets — don't load env for them.

```yaml
- run: npx dotenvx run -f .env.development --strict -- your-command
  env:
    DOTENV_PRIVATE_KEY_DEVELOPMENT: ${{ secrets.DOTENV_PRIVATE_KEY_DEVELOPMENT }}
```

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
