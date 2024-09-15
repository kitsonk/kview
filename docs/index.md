# Introduction

`kview` is a web application that provides a visual view of data stored in a
Deno KV store. It requires the Deno CLI to be its host.

## Local KV

### Auto discovered

The application will use the same logic that the Deno CLI does to determine the
default cache location for KV stores, and will enumerate them. The logic Deno
CLI uses to cache "origin storage" is to generate a unique hash of the origin.
This means it is not possible for `kview` to be able to determine what script
the store belongs to. Instead `kview` allows you to name individual stores it
detects, which get stored in a cookie in the browser.

### Specified local KV

`kview` allows you to manually add local KV stores where you specify the path to
the store like you would with `Deno.openKv("/path/to/store")`. If `kview` is
able to access the store it will add it to the local stores. Specified local
stores will persist across runs of the server by persisting information in local
storage. When starting up the `kview` instance or updating specified local
stores, `kview` will validate that each store is actually a file and remove any
that are no longer valid.

### Naming stores

To name or change a name of a local store, click on the store name and either
press <kbd>Enter</kbd> or click elsewhere to save the value. Pressing
<kbd>ESC</kbd> will discard any edits.

Navigating to an individual local KV store will allow you to navigate the
contents of the store.

## Remote KV

You can connect to arbitrary remote Deno KV stores. This is specifically
designed to be able to connect to
[hosted `denokv` instances](https://deno.com/blog/kv-is-open-source-with-continuous-backup#self-host-deno-kv-with-denokv).

Remote KV stores can be added by selecting the `Add remote store` button which
will open an add dialog. You will be prompted for the URL and access token to
connect to the instance as well as an optional name making it easier to identify
the instance.

Currently, there is no easy way to validate a remote connection URL. Deno will
continually try to connect to remote locations even if the connection is wrong.
Therefore there is a "Validate connection" button when adding or editing the
configuration of a remote store.

You can delete the connection information to a remote store by selecting the
store in the list of remotes and choosing to delete it. This will only delete
the configuration information held in `kview` and does not modify anything in
the remote store.

Remote servers are accessible by everyone who has access to the instance of
`kview` and the connection information is persisted in Deno CLI via local
storage, which means they will be persisted from invocation to invocation of the
server.

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

## Blobs

Deno KV is limited to values of a max of 64k in size. This can make it
challenging to manage arbitrary binary data. In addition,
[currently](https://github.com/denoland/deno/issues/12067) Deno KV does not
support storing `Blob` or `File` instances, though they are _cloneable_ and
should be able to be stored.

To work around these challenges,
[kv-toolbox](https://jsr.io/@kitsonk/kv-toolbox) provides the ability to store
arbitrarily size blobs and can handle setting values to `Blob`, `File`, array
buffers, typed arrays, and byte `ReadableStream`s. It accomplishes this by
storing the binary data into chunks that avoid the 64k value limit along with
meta data about the original form of the data.

kview integrations kv-toolbox to allow management and viewing of the blobs. The
user interface detects the blobs and displays them in the way they are intended,
as a single entry, though they are made up of several component entries in
reality.

For `File` and `Blob` entries, kview will detect the any associated context type
and if it is media that is viewable within a browser, it will be displayed as
part of the view of the entry value.

Each blob value will have a download link associated with it, which will allow
you to download and save the blob.

### Adding or updating blobs

kview allows adding or updating blobs. When adding an entry or updating the
value of an entry, the _Value Type_ will allow you to select _Binary Data_,
_Blob_ or _File_ and the value will be a file selection input. _Binary Data_
will be stored as the blob type of a buffer which can be retrieved as a
`Uint8Array` or byte `ReadableStream`, while _Blob_ and _File_ will be stored
and retrieved as `Blob`s and `File`s.

## Bulk operations

### Import

`kview` supports import data into a Deno KV store in the format of new line
deliminated JSON ([ndjson](https://ndjson.org)), where each entry is provided as
a standalone JSON object delimitated by a new line.

While exploring a KV store, an `Import...` button will be available. Clicking on
the button will bring up a dialog to select the file to import into the target
KV store.

To see information about import jobs, you can select _Jobs_ on the left hand
side. The current status will be provided along with other details. Job
information is only stored in the memory of the current server, so will
disappear when the server is restarted.

### Export

`kview` supports exporting data from a Deno KV store in the format of new line
delimitated JSON ([ndjson](https://ndjson.org/)), where each entry is provided
as a standalone JSON object delimitated by a new line. The main reason for this
versus a pure JSON output is that the format supports streaming.

When exploring a KV store, an `Export...` button will be available. When
clicking on the export button, a confirmation dialog will be displayed. When at
the root of the store, the export will export all the entries from the store.
When having navigated to a sub-key, only the entries which have a prefix of the
current key will be exported.

Also because the of rich set of key types and value types that Deno KV supports
it is necessary to reformat key parts and values into forms that can be fully
serialized in JSON. The interface for each line is:

```ts
interface KvEntryJSON {
  key: KvKeyJSON;
  value: KvValueJSON;
  versionstamp: string;
}
```

Of which you would expect an entry with a key of `["a"]` and a value of
`"string"` to look like this:

```json
{
  "key": [{ "type": "string", "value": "a" }],
  "value": { "type": "string", "value": "string" },
  "versionstamp": "000000000001b3950000"
}
```

A full set of TypeScript types describing how KV entries are serialised is
available in
[`@kitsonk/kv-toolbox/json`](https://jsr.io/@kitsonk/kv-toolbox/doc/json/~).

### Deleting

Pressing the `Delete...` button in the KV explorer will bring up a tree view of
all keys that are children of the root or current key. Selecting keys in here
will allow multiple entries to be deleted at once.

## Watches

When browsing entries there will be an eye icon. When selected this will store
the entry to be watched:

<svg width="16" height="16" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g><path d="m442.37 268.29c5.6328-7.168 5.6328-16.895 0-24.062-3.582-4.0977-83.969-98.305-186.37-98.305s-182.79 93.695-186.37 97.793c-5.6328 7.168-5.6328 16.895 0 24.062 3.582 4.0938 83.969 98.301 186.37 98.301s182.79-94.207 186.37-97.789zm-201.21-74.242c12.801 0 23.039 10.238 23.039 23.039 0 12.801-10.238 23.039-23.039 23.039-12.801 0-23.039-10.238-23.039-23.039 0-12.797 10.238-23.039 23.039-23.039zm14.848 134.66c-65.023 0-122.37-49.152-145.92-72.703 14.848-14.848 43.52-39.938 79.359-56.32-3.5859 8.7031-5.6328 17.922-5.6328 28.16 0 39.938 32.258 72.703 72.703 72.703 39.938 0 72.703-32.258 72.703-72.703 0-9.7266-2.0469-19.457-5.6328-28.16 35.84 16.383 64.512 41.473 79.359 56.32-24.57 23.551-81.914 72.703-146.94 72.703z"/><path d="m18.945 198.66h25.602c3.5859 0 6.1445-3.0703 6.1445-6.1445l-0.003906-88.574h88.574c3.5859 0 6.1445-3.0703 6.1445-6.1445v-25.602c0-3.5859-3.0703-6.1445-6.1445-6.1445h-120.32c-3.5859 0-6.1445 3.0703-6.1445 6.1445v120.32c0 3.5859 3.0703 6.1445 6.1445 6.1445z"/><path d="m139.78 408.06h-88.578v-88.574c0-3.5859-3.0703-6.1445-6.1445-6.1445h-25.602c-3.5859 0-6.1445 3.0703-6.1445 6.1445v120.32c0 3.5859 3.0703 6.1445 6.1445 6.1445h120.32c3.5859 0 6.1445-3.0703 6.1445-6.1445v-25.602c0.003906-3.0703-3.0703-6.1445-6.1406-6.1445z"/><path d="m493.05 65.535h-120.83c-3.5859 0-6.1445 3.0703-6.1445 6.1445v25.602c0 3.5859 3.0703 6.1445 6.1445 6.1445h88.578v88.574c0 3.5859 3.0703 6.1445 6.1445 6.1445h25.602c3.5859 0 6.1445-3.0703 6.1445-6.1445l-0.003906-119.81c0.51172-3.582-2.5586-6.6562-5.6328-6.6562z"/><path d="m493.05 313.34h-25.602c-3.5859 0-6.1445 3.0703-6.1445 6.1445v88.574h-89.086c-3.5859 0-6.1445 3.0703-6.1445 6.1445v25.602c0 3.5859 3.0703 6.1445 6.1445 6.1445h120.32c3.5859 0 6.1445-3.0703 6.1445-6.1445v-120.32c0.51172-3.5859-2.5586-6.1445-5.6328-6.1445z"/></g></svg>

Navigating to the _Watch_ section will display all valid watches grouped by KV
store and continue to monitor them. A watch can be removed by clicking on the
trashcan icon on the entry card:

<svg width="16" height="16" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="m135.53 123.21h243.68c27.379 0 52.02 24.641 52.02 54.758v279.27c0 30.117-24.641 54.758-52.02 54.758h-243.68c-30.117 0-54.758-24.641-54.758-54.758v-279.27c0-30.117 24.641-54.758 54.758-54.758zm73.926-123.21h95.828c30.117 0 27.379 30.117 27.379 52.02h71.188c16.43 0 27.379 13.691 27.379 30.117 0 16.43-10.953 27.379-27.379 27.379h-292.96c-16.43 0-30.117-10.953-30.117-27.379 0-16.43 13.691-30.117 30.117-30.117h68.449c0-21.902-2.7383-52.02 30.117-52.02zm84.879 52.02c-2.7383-8.2148-10.953-16.43-19.164-16.43h-35.594c-10.953 0-19.164 8.2148-21.902 16.43h76.664zm-131.42 128.68c10.953 0 16.43 8.2148 16.43 16.43v249.16c0 8.2148-5.4766 16.43-16.43 16.43-8.2148 0-13.691-8.2148-13.691-16.43v-249.16c0-8.2148 5.4766-16.43 13.691-16.43zm93.09 0c8.2148 0 16.43 8.2148 16.43 16.43v249.16c0 8.2148-8.2148 16.43-16.43 16.43s-16.43-8.2148-16.43-16.43v-249.16c0-8.2148 8.2148-16.43 16.43-16.43zm93.09 0c8.2148 0 16.43 8.2148 16.43 16.43v249.16c0 8.2148-8.2148 16.43-16.43 16.43s-16.43-8.2148-16.43-16.43v-249.16c0-8.2148 8.2148-16.43 16.43-16.43z" fill-rule="evenodd"/></svg>

## Data Types

### Key Parts

Deno KV supports keys of a size of up to 2k. Each type of key part is supported
by kview.

| Type       | Supported | Notes                                                                                                |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------- |
| String     | ✅        |                                                                                                      |
| Number     | ✅        | Key parts are entered as digits only                                                                 |
| Boolean    | ✅        | Key parts are entered as `true` or `false`                                                           |
| BigInt     | ✅        | Key parts are entered as digits only                                                                 |
| Uint8Array | ✅        | Key parts are entered as URL safe base64 encoded strings, the value of the key part is not displayed |

### Values

Deno KV supports any JavaScript built-in types that are supported via structured
clone. The values are limited to 64k in their stored format. kview via
kv-toolbox add support for three blob types. These have no hard size limit. The
support table is seen below:

| Type                | View | Add | Update | Notes                                                                                                                                                           |
| ------------------- | ---- | --- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| String              | ✅   | ✅  | ✅     |                                                                                                                                                                 |
| Number              | ✅   | ✅  | ✅     | Deno KV stores `NaN` and `Infinity`, but currently kview cannot display them as values or allow you to set or update to those values.                           |
| Boolean             | ✅   | ✅  | ✅     |                                                                                                                                                                 |
| BigInt              | ✅   | ✅  | ✅     | Values are entered/edited as number digits                                                                                                                      |
| Undefined           | ✅   | ✅  |        | Values can be changed to `undefined` but the value itself is not editable intentionally.                                                                        |
| Null                | ✅   | ✅  |        | Values can be changed to `null` but the value itself is not editable intentionally.                                                                             |
| `KvU64`             | ✅   | ✅  | ✅     | Values are entered/edited as number digits                                                                                                                      |
| `Array`             | ✅   | ✅  | ✅     | Values are entered/edited as JSON arrays                                                                                                                        |
| `Map`               | ✅   | ✅  | ✅     | Values are entered/edited as JSON array tuples of key and values                                                                                                |
| `Set`               | ✅   | ✅  | ✅     | Values are entered/edited as JSON arrays                                                                                                                        |
| `Date`              | ✅   | ✅  | ✅     | Values are entered/edited as ISO strings in the format of `YYYY-MM-DDTHH:mm:ss.sssZ` or `±YYYYYY-MM-DDTHH:mm:ss.sssZ`                                           |
| `RegExp`            | ✅   | ✅  | ✅     | Values are entered/edited as JavaScript regular expression literals (e.g. `/abcd/i`)                                                                            |
| `Error`             | ✅   |     |        |                                                                                                                                                                 |
| `EvalError`         | ✅   |     |        |                                                                                                                                                                 |
| `RangeError`        | ✅   |     |        |                                                                                                                                                                 |
| `ReferenceError`    | ✅   |     |        |                                                                                                                                                                 |
| `SyntaxError`       | ✅   |     |        |                                                                                                                                                                 |
| `TypeError`         | ✅   |     |        |                                                                                                                                                                 |
| `URIError`          | ✅   |     |        |                                                                                                                                                                 |
| `ArrayBuffer`       | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Int8Array`         | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Uint8ClampedArray` | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Uint8ClampedArray` | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Int16Array`        | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Uint16Array`       | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Int32Array`        | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Uint32Array`       | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Float32Array`      | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `Float64Array`      | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `BigInt64Array`     | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| `BigUint64Array`    | ✅   | ✅  |        | Values are added as URL safe base64 encoded strings. View is displayed as a hex byte viewer.                                                                    |
| Binary Data         | ✅   | ✅  | ✅     | Values are added/updated by loading files. Only byte length is available as view. This is stored across multiple keys via kv-toolbox.                           |
| `Blob`              | ✅   | ✅  | ✅     | Values are added/updated by loading files. If the type can be displayed in a browser, it will be displayed. This is stored across multiple keys via kv-toolbox. |
| `File`              | ✅   | ✅  | ✅     | Values are added/updated by loading files. If the type can be displayed in a browser, it will be displayed. This is stored across multiple keys via kv-toolbox. |
| JSON                | ✅   | ✅  | ✅     | Other `object`s use the structured clone algorithm and added/updated by entering a JSON value.                                                                  |

## Limitations

- Deno KV supports key parts that are Uint8Array. While `kview` properly handles
  these key parts, displaying them is problematic. Each unique Uint8Array will
  be displayed separately, and in the sort order provided by Deno KV, but there
  is no way to tell one Uint8Array key part from another.
- `kview` cannot determine the "origin" associated with local KV stores.
- Deno currently does not handle remote stores well enough to be resilient to
  accidental user misconfiguration (see
  [denoland/deno#21211](https://github.com/denoland/deno/issues/21211) and
  [denoland/deno#21263](https://github.com/denoland/deno/issues/21263). When
  viewing a remote store that is not correctly configured, it will simply appear
  to "hang", loading indefinitely. Use the "Validate connection" button when
  adding or updating the configuration to attempt to diagnose configuration
  issues.
- For local datastores, currently Deno does not support watches where changes
  are made in other processes (see
  [denoland/deno#21640](https://github.com/denoland/deno/issues/21640)).
  Therefore changes made outside of `kview` will not be observed via a watch,
  but a refresh of the page will update any changes to values.

## Roadmap Items

`kview` is not yet functionally complete. Here is a roadmap of items that would
be great to add to `kview`:

- Improve editing/adding complex values.
- "Flash" updates on watches.
- Document APIs to enable custom integrations.
- More "batch" tooling, like syncing KV stores, etc.
- Ability to upload binary data as an `Uint8Array`.
- Ability to download `Uint8Array` as a file.
- Improve accessability.
- Ability to change the cache location for local KV stores.
- Allow deep linking into KV store keys and values.
- Integrate the crypto capabilities of kv-toolbox.
