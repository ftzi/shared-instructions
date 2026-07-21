# dotenvx Standard

Secrets management with [dotenvx](https://dotenvx.com). Encrypted env files are committed to the repo — safe to share, review, and branch with.

## Files

- `.env.development` — non-production secrets (local dev, PR CI, ephemeral branches)
- `.env.production` — production secrets (main-branch deploys, prod CI)

Both files are committed. Each is encrypted with its own key pair:

- `DOTENV_PUBLIC_KEY_DEVELOPMENT` / `DOTENV_PRIVATE_KEY_DEVELOPMENT`
- `DOTENV_PUBLIC_KEY_PRODUCTION` / `DOTENV_PRIVATE_KEY_PRODUCTION`

The public keys header the encrypted file (committed). The private keys live in `.env.keys` (git-ignored, NEVER committed) and are stored as GitHub Secrets:

- `DOTENV_PRIVATE_KEY_DEVELOPMENT`
- `DOTENV_PRIVATE_KEY_PRODUCTION`

Encrypted values start with `encrypted:` and are safe to commit.

## Commands

```sh
# Set a value (encrypts automatically)
bunx dotenvx set KEY value -f .env.development
bunx dotenvx set KEY value -f .env.production

# Encrypt after manual plaintext edits
bunx dotenvx encrypt -f .env.development
bunx dotenvx encrypt -f .env.production

# Decrypt and read a single value
bunx dotenvx get KEY -f .env.production

# Run a command with decrypted env loaded
# --strict fails if any value is plaintext/missing — guards against unencrypted secrets
bunx dotenvx run -f .env.production --strict -- <command>
```

## CI Rules

- **PR / E2E workflows** load `.env.development` with `DOTENV_PRIVATE_KEY_DEVELOPMENT`.
- **Main-merge deploy workflows** load `.env.production` with `DOTENV_PRIVATE_KEY_PRODUCTION`.
- Use `dotenvx run --strict` to surface any unencrypted value as a hard failure.
- NEVER reference individual GitHub secrets (e.g. `secrets.API_KEY`) for app config in deploy/migrate steps. Load env from the encrypted file instead.
- Pure validation steps (lint, typecheck, test) generally need no secrets — don't load env for them.
