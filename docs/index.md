# Introduction

`kview` is a web application that provides a visual view of data stored in a
Deno KV store. It requires the Deno CLI to be its host.

## Local KV

The application will use the same logic that the Deno CLI does to determine the
default cache location for KV stores, and will enumerate them. The logic Deno
CLI uses to cache "origin storage" is to generate a unique hash of the origin.
This means it is not possible for `kview` to be able to determine what script
the store belongs to. Instead `kview` allows you to name individual stores it
detects, which get stored in a cookie in the browser.

To name or change a name of a local store, click on the store name and either
press <kbd>Enter</kbd> or click elsewhere to save the value. Pressing
<kbd>ESC</kbd> will discard any edits.

Navigating to an individual local KV store will allow you to navigate the
contents of the store.

## Deno Deploy KV

In order to provide connections to remote Deno Deploy KV stores, the application
needs to leverage a Deno Deploy access token. In order to get an access token,
you need to be logged in [`dash.deno.com`](https://dash.deno.com/) and navigate
to the [Access Tokens](https://dash.deno.com/account#access-tokens) part of your
account setting and create a new access token.

You can then use that token to login with `kview` which will then start
displaying your user account and any organizations that you belong to. Clicking
on your user or an organization will list the projects owned by that user or
organization.

Choosing a project will provide a view of what branches can have KV stores
associated with them and navigating to a branch will start displaying the
contents of the KV store.

The current access token is stored locally within the browser as a cookie,
meaning that access token is not shared across the server.

## KV Explorer

Once you have navigated to a specific KV store, you will be provided with the
contents of the store.

Keys in Deno KV are made up of key parts, which allow you to easily form a
hierarchy of keys and values. For example you have have `["person", 1]` and
`["person", 2]` as keys. `kview` works on the concept of navigating a KV store
by navigating key parts, where keys are grouped into shared key parts.

For the example above, a key part of `person` would be displayed and navigating
to `person` would then display two key parts of `1` and `2`. Navigating to those
key parts would display the value associated with the key.

If a key part is associated with a key that does not have any sub keys, only a
value, the key part will display a right arrow:

<svg height="16" width="16" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="m160.26 499.2c-13.312 0-26.113-5.1211-36.352-14.848-19.969-19.969-19.969-52.734 0-72.703l155.13-155.65-155.14-155.65c-19.969-19.969-19.969-52.734 0-72.703s52.734-19.969 72.703 0l192 192c9.7266 9.7266 14.848 22.527 14.848 36.352s-5.6328 26.625-14.848 36.352l-192 192c-10.242 9.7266-23.555 14.848-36.352 14.848z" /></svg>

If the key part is associated with a key that does have sub keys (and
potentially a value), the key part will display an expand icon:

<svg height="16" width="16" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g><path d="m464.57 486.4h-181.78c-12.051 0-21.828-9.7734-21.828-21.828 0-12.051 9.7734-21.828 21.828-21.828h159.95v-373.5h-373.5v154.39c0 12.051-9.7734 21.828-21.828 21.828-12.051 0.003906-21.816-9.7695-21.816-21.816v-176.21c0-12.055 9.7734-21.82 21.824-21.82h417.15c12.047 0 21.82 9.7656 21.82 21.82v417.15c0 12.059-9.7734 21.824-21.824 21.824z" /><path d="m390.2 143.61v79.879c0 12.059-9.7656 21.828-21.828 21.828s-21.828-9.7656-21.828-21.828v-27.172l-91.164 91.164c-4.2539 4.2539-9.8203 6.3828-15.441 6.3828-5.5664 0-11.133-2.1289-15.387-6.3828-8.5664-8.5078-8.5664-22.371 0-30.879l91.117-91.172h-27.117c-12.059 0-21.828-9.7656-21.828-21.828 0-12.059 9.7656-21.828 21.828-21.828h79.82c12.059 0.007813 21.828 9.7773 21.828 21.836z" /><path d="m197.47 486.4h-150.04c-12.051 0-21.824-9.7656-21.824-21.82v-150.04c0-12.051 9.7734-21.828 21.828-21.828h150.04c12.051 0 21.828 9.7734 21.828 21.828v150.04c-0.011719 12.055-9.7812 21.82-21.832 21.82zm-128.22-43.645h106.39v-106.39h-106.39z" /></g></svg>

As key parts are descended the _Path_ will be updated, allow navigation back up
the stack of key parts. Navigating to the home icon in the path will bring you
back to the root of the store.

When navigating to a partial key that does not have a value associated with, the
value display will display _no value_. This different than an actual _null_
value, which is supported by Deno KV.

## Limitations

- Deno KV supports key parts that are Uint8Array. While `kview` properly handles
  these key parts, displaying them is problematic. Each unique Uint8Array will
  be displayed separately, and in the sort order provided by Deno KV, but there
  is no way to tell one Uint8Array key part from another.
- `kview` cannot determine the "origin" associated with local KV stores.

## Roadmap Items

`kview` is far from functionally complete. Here is a roadmap of items that would
be great to add to `kview`:

- Edit values.
- "Batch" tooling, like syncing KV stores, batch uploading, etc.
- Better display of Uint8Arrays.
- Support for direct `Request` and `Response`.
- Better support for arbitrary cloneable objects.
- Improve accessability.
- Ability to add a specific local KV store.
- Ability to change the cache location for local KV stores.
- Allow deep linking into KV store keys and values.
