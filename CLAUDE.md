# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**kview** is a Deno/Fresh web application for browsing and managing Deno KV databases — both local SQLite-backed stores
and remote Deno Deploy KV stores. It provides an interactive UI to explore key trees, view/edit entries, and manage
multiple store connections.

## Commands

```sh
deno task dev      # Start Vite dev server with hot reload
deno task build    # Build for production (outputs to _fresh/)
deno task start    # Serve the built application via deno serve
deno task check    # fmt --check + lint + type-check (run before committing)
deno task test     # Execute unit tests (run before committing)
deno task update   # Update Fresh framework
```

## Architecture

### Stack

- **Runtime**: Deno with unstable KV API enabled
- **Framework**: Fresh v2 (filesystem routing, SSR + islands)
- **UI**: Preact + Preact Signals for reactive state
- **Styling**: Tailwind CSS v4 + DaisyUI v5 via Vite

### Directory Structure

- `routes/` — Page routes and API handlers (Fresh filesystem routing)
  - `api/local/` — Manage local store registry
  - `api/store/[id]/` — KV operations: `tree/`, `entry/`, `blob/`, `count/`, `meta/`
- `components/` — Server-rendered Preact components (no interactivity)
- `islands/` — Interactive Preact islands (hydrated client-side); currently `KVExplorer.tsx` is the main one
- `utils/` — Business logic, helpers, and unit tests
- `assets/` — CSS entry points (`styles.css` imports `tailwind.css` and `daisyui.css`)
- `static/` — Served as-is (images, etc.)

### Key Files

- `main.ts` — Fresh app entry point; defines middleware (static files, request logging)
- `utils/fresh.ts` — Shared `State` type (`currentKvStoreId`, `sessionToken`)
- `utils/state.ts` — Global Preact Signals state (store list, synced to localStorage)
- `utils/kv.ts` / `utils/kv_state.ts` — KV toolbox wrappers; `getToolbox()` caches open connections per store
- `utils/kv_json.ts` — Serialization of KV values to/from JSON with type metadata

### State Management

- Preact Signals (`utils/state.ts`) hold the list of known stores (local + remote)
- Store metadata persists to localStorage on the client
- The Fresh `State` context (`utils/fresh.ts`) carries per-request data (current store ID, session token)

### Logging

Uses `@logtape/logtape` with the category prefix `["kview", ...]`. Log level is controlled via the `LOG_LEVEL`
environment variable.

## Configuration Notes

- `deno.json`: `@/` import alias maps to the project root; JSX configured for Preact precompilation; formatter uses
  120-char line width
- `vite.config.ts`: Minimal — delegates to `@fresh/plugin-vite` and `@tailwindcss/vite`
- KV unstable API (`--unstable-kv`) is required and enabled via `deno.json`
- `nodeModulesDir: "manual"` — Deno manages `node_modules`; run `deno install` if missing
- Prefer using JSR packages (jsr.io) over npm packages when possible.
- Add dependencies via `deno add`
