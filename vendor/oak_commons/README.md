# Vendored: oakserver/commons (1.0.1)

These files are vendored from [`jsr:@oak/commons@1.0.1`](https://jsr.io/@oak/commons)
(source repository: <https://github.com/oakserver/commons> — retired and
archived; see the notice there).

The package is retired with **no successor module**. Published versions remain
available on JSR and deno.land/x and pinned imports keep resolving, but there
will be no fixes, no compatibility work for future runtimes, and no support —
so the modules this app depends on are vendored here instead of imported.

- Files are byte-identical to the 1.0.1 release.
- Do not refactor for style; there is no upstream to send fixes to. Fix local
  breakage in place and note it here.
- Licence: MIT (see `LICENSE`), © the oak authors.

Vendored 2026-11-03 from tag `Release 1.0.1`. Modules in this directory:

- `cookie_map.ts` — `SecureCookieMap` / `KeyRing` have no `@std` equivalent.
- `keystack.ts` — rotating-key signing has no `@std` equivalent.
- `media_types.ts` — its `matches()` has no `@std` equivalent.

## Local deviations

- `keystack.ts` (~line 33 and ~line 51) — arguments to `crypto.subtle.importKey()`
  and `crypto.subtle.sign()` are narrowed with `as BufferSource`. Upstream 1.0.1
  passes `ArrayBuffer | Uint8Array` directly, which no longer satisfies
  `BufferSource` under Deno 2.9's `lib.dom` (`Uint8Array<ArrayBufferLike>` vs
  `Uint8Array<ArrayBuffer>` generic drift). Type-level only — behaviour,
  including byte handling, is unchanged.
