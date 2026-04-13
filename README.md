# stelagent

Modular, agent-first CLI for Stellar — wallet, payments, markets, and DeFi.

Stelagent provides a skill-based command architecture for interacting with the Stellar network. It combines wallet management, x402 micropayments, Horizon API insights, and real-time monitoring into a single developer-friendly CLI.

## Architecture

- **`packages/cli/src/`** — CLI binary (`stelagent`), built with citty + Effect-TS
- **`apps/website/`** — TanStack Start web app (API server + dashboard)
- **`skills/`** — Agent skill definitions (SKILL.md + CLI command references)

## Development

```bash
vp install
vp run ready
vp run dev
```

## CLI Quick Start

```bash
stelagent wallet login -e you@example.com   # Interactive login
stelagent wallet address                    # Show public key
stelagent wallet balance                    # Show balances
stelagent wallet transfer -t GDXXX... -a 10  # Send XLM
stelagent send GDXXX... 100 -a USDC:GAXYZ...  # Send any asset
stelagent pay https://api.example.com/premium  # X402 payment
```

All commands output structured JSON:

```json
{ "ok": true, "data": { ... } }
```
