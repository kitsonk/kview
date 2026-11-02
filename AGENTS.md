# AGENTS.md

Compact guidance for OpenCode sessions working on **kview**, a Deno/Fresh v2 web app for browsing Deno KV stores.

## Developer Commands

```sh
deno task dev      # Vite dev server with hot reload
deno task build    # Production build → outputs to _fresh/
deno task start    # Serve built app: deno serve -A _fresh/server.js
deno task check    # fmt --check + lint + type-check (run before committing)
deno task test     # Unit tests via Deno.test()
deno task update   # Update Fresh framework
```

**Required order before committing:** `check` then `test`. `check` includes formatting, linting, and type-checking.

## Architecture

- **Runtime:** Deno with unstable KV API (`"unstable": ["kv"]` in `deno.json`)
- **Framework:** Fresh v2 with filesystem routing (`routes/`)
- **UI:** Preact + Preact Signals; JSX precompiled (`jsx: "precompile"`)
- **Styling:** Tailwind CSS v4 + DaisyUI v5 via Vite. **No `tailwind.config.ts`** — configuration is CSS-based in
  `assets/styles.css`.
- **Build:** Vite with `@fresh/plugin-vite` and `@tailwindcss/vite`

### Directory Ownership

- `routes/` — Page routes and API handlers (Fresh filesystem routing)
  - `api/local/` — Local store registry endpoints
  - `api/store/[id]/` — KV operations: `tree/`, `entry/`, `blob/`, `count/`, `meta/`
- `components/` — Server-rendered Preact components (**no client interactivity**)
- `islands/` — Interactive Preact islands (hydrated client-side)
- `utils/` — Business logic, helpers, **and unit tests** (`*.test.ts`)
- `assets/` — CSS entry points and Tailwind/DaisyUI imports
- `static/` — Static assets served as-is

### Key Files

- `main.ts` — Fresh app entry point; sets up middleware and `fsRoutes()`
- `utils/fresh.ts` — Shared `State` type (`currentKvStoreId`, `sessionToken`)
- `utils/state.ts` — Global Preact Signals (store list, synced to localStorage)
- `utils/kv.ts` / `utils/kv_state.ts` — KV toolbox wrappers; `getToolbox()` caches open connections per store
- `utils/kv_json.ts` — Serialization of KV values to/from JSON with type metadata

## State Management

- **Client global state:** Preact Signals in `utils/state.ts`, persisted to localStorage
- **Per-request state:** Fresh `State` context (`utils/fresh.ts`)
- **KV connections:** Cached per-store via `getToolbox()` in `utils/kv.ts`

## Configuration & Conventions

- **Import alias:** `@/` maps to project root (`./`)
- **Line width:** 120 characters (`deno.json` `fmt.lineWidth`)
- **Lint rules:** Fresh + recommended tags (`deno.json` `lint.rules.tags`)
- **node_modules:** `nodeModulesDir: "manual"` — Deno manages `node_modules/`. Run `deno install` if missing.
- **Dependencies:** Prefer JSR packages over npm. Add via `deno add`.
- **Tests:** Use `Deno.test()` with `@std/assert` imports. Tests live alongside source in `utils/`.
- **Logging:** `@logtape/logtape` with category prefix `["kview", ...]`. Control via `LOG_LEVEL` env var.
- **Deploy target:** Deno Deploy (`deno.json` `deploy` field: org `kitsonkelly`, app `kview-panel`)

## Gotchas

- `deno task start` serves the **built** application from `_fresh/`. You must `deno task build` first.
- The KV API requires `--unstable-kv`, which is enabled in `deno.json`.
- Do not create a `tailwind.config.ts` — Tailwind v4 uses CSS-based configuration.
- `_fresh/` is excluded from formatting and linting (`deno.json` `exclude`).
