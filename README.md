# kview

A web interface for viewing Deno KV stores.

## Usage

See [docs](./docs/index.md) for information on how to use `kview`, roadmap, and
known limitations; which is also integrated into the webapp.

## Installation

A current version of the Deno CLI is required to install and host `kview`. To
install, run the following command:

```
deno run -A https://kview.deno.dev/install
```

You will be prompted for a location to install `kview`.

Once the installation is complete, change to the installation directory and run
the following to start the `kview` server:

```
deno task start
```

> [!TIP]
> The [kitsonk/kview](https://github.com/kitsonk/kview) repository can also be
> cloned, though this will effectively be a development environment for kview,
> versus a standalone web application.

---

Copyright 2023-2024 Kitson P. Kelly. All Rights Reserved. MIT License.
