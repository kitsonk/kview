import { type ComponentChildren } from "preact";
import { type BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { type KvKeyJSON, type KvValueJSON } from "@kitsonk/kv-toolbox/json";
import { highlightJson } from "$utils/highlight.ts";

import { BlobViewer } from "./BlobViewer.tsx";
import { HexViewer } from "./HexViewer.tsx";
import { gray } from "https://deno.land/std@0.216.0/fmt/colors.ts";

function Display({ children }: { children: ComponentChildren }) {
  return (
    <div class="rounded p-1 bg-gray(100 dark:800) max-h-64 lg:max-h-108 overflow-y-auto overflow-x-auto">
      {children}
    </div>
  );
}

export function KvValue(
  { databaseId, currentKey, value, meta }: {
    databaseId?: string;
    currentKey?: KvKeyJSON;
    value?: KvValueJSON;
    meta?: BlobMeta;
  },
) {
  let color;
  let label;
  let children;
  let border = false;

  if (meta && databaseId && currentKey) {
    children = (
      <Display>
        <BlobViewer
          databaseId={databaseId}
          currentKey={currentKey}
          meta={meta}
        />
      </Display>
    );
    color = gray;
    border = true;
    switch (meta.kind) {
      case "blob":
        label = "Blob";
        break;
      case "buffer":
        label = "Binary Data";
        break;
      case "file":
        label = "File";
        break;
    }
  } else if (value) {
    switch (value.type) {
      case "KvU64":
        label = "Deno.KvU64";
        color = "pink";
        children = <Display>{value.value}n</Display>;
        break;
      case "Map":
        label = "Map";
        color = "red";
        children = (
          <Display>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="p-2">Key</th>
                  <th class="p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {value.value.map(([key, value]) => (
                  <tr class="odd:bg-gray(50 dark:900)">
                    <td>
                      <pre><code>{JSON.stringify(key, undefined, "  ")}</code></pre>
                    </td>
                    <td>
                      <pre><code>{JSON.stringify(value, undefined, "  ")}</code></pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "RegExp":
        label = "RegExp";
        color = "yellow";
        children = (
          <Display>
            <pre><code>{value.value}</code></pre>
          </Display>
        );
        break;
      case "Set":
        label = "Set";
        color = "red";
        children = (
          <Display>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="p-2">Item</th>
                </tr>
              </thead>
              <tbody>
                {value.value.map((item) => (
                  <tr class="odd:bg-gray(50 dark:900)">
                    <td>
                      <pre><code>{JSON.stringify(item, undefined, "  ")}</code></pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "ArrayBuffer":
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array":
        label = value.type;
        color = "gray";
        border = true;
        children = (
          <HexViewer
            value={value.value}
            class="max-h-64 lg:max-h-108 overflow-x-auto"
          />
        );
        break;
      case "bigint":
        label = "BigInt";
        color = "indigo";
        children = <Display>{value.value}n</Display>;
        break;
      case "boolean":
        label = "Boolean";
        color = "green";
        children = (
          <Display>
            <span class="font-bold">{String(value.value)}</span>
          </Display>
        );
        break;
      case "null":
        label = "Null";
        color = "gray";
        border = true;
        children = (
          <Display>
            <span class="font-bold italic text-gray-500">null</span>
          </Display>
        );
        break;
      case "undefined":
        label = "Undefined";
        color = "gray";
        border = true;
        children = (
          <Display>
            <span class="font-bold italic text-gray-500">undefined</span>
          </Display>
        );
        break;
      case "number":
        label = "Number";
        color = "purple";
        children = <Display>{value.value}</Display>;
        break;
      case "Date":
        label = "Date";
        color = "orange";
        children = <Display>{value.value}</Display>;
        break;
      case "Error":
      case "EvalError":
      case "RangeError":
      case "ReferenceError":
      case "SyntaxError":
      case "TypeError":
      case "URIError":
        label = value.type;
        color = "red";
        children = (
          <Display>
            <table class="w-full">
              <tbody>
                <tr>
                  <td>Type:</td>
                  <td>{value.type}</td>
                </tr>
                <tr>
                  <td>Message:</td>
                  <td>{value.value.message}</td>
                </tr>
                {value.value.stack && (
                  <tr>
                    <td>Stack:</td>
                    <td>
                      <pre>{value.value.stack}</pre>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Display>
        );
        break;
      case "Array":
        label = value.type;
        color = "blue";
        children = (
          <Display>
            <pre><code dangerouslySetInnerHTML={{ __html: highlightJson(value.value)}}></code></pre>
          </Display>
        );
        break;
      case "object":
        label = "JSON";
        color = "blue";
        children = (
          <Display>
            <pre><code dangerouslySetInnerHTML={{ __html: highlightJson(value.value) }}></code></pre>
          </Display>
        );
        break;
      case "string":
        label = "String";
        color = "blue";
        children = (
          <Display>
            <pre><code>{value.value}</code></pre>
          </Display>
        );
        break;
    }
  }

  return (
    <div>
      <h2 class="font-bold my-2">Type</h2>
      <div>
        <div
          class={`bg-${color}-100 text-${color}-800 px-2.5 py-0.5 m-1 inline-block rounded dark:(bg-${color}-900 text-${color}-300) ${
            border ? "border" : ""
          }`}
        >
          {label}
        </div>
      </div>
      <h2 class="font-bold my-2">Value</h2>
      {children}
    </div>
  );
}
