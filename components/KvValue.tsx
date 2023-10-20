import { type KvValueJSON } from "$utils/kv.ts";
import { decodeBase64Url } from "$std/encoding/base64url.ts";

export function KvValue({ value }: { value: KvValueJSON }) {
  let color;
  let label;
  let children;
  let border = false;

  switch (value.type) {
    case "KvU64":
      label = "Deno.KvU64";
      color = "pink";
      children = `${value.value}n`;
      break;
    case "Map":
      label = "Map";
      color = "red";
      children = (
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
      );
      break;
    case "RegExp":
      label = "RegExp";
      color = "yellow";
      children = <pre><code>{value.value}</code></pre>;
      break;
    case "Set":
      label = "Set";
      color = "red";
      children = (
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
      );
      break;
    case "Uint8Array":
      label = "Uint8Array";
      color = "gray";
      border = true;
      children = (
        <pre><code>{JSON.stringify([...decodeBase64Url(value.value)])}</code></pre>
      );
      break;
    case "bigint":
      label = "BigInt";
      color = "indigo";
      children = `${value.value}n`;
      break;
    case "boolean":
      label = "Boolean";
      color = "green";
      children = <span class="font-bold">{String(value.value)}</span>;
      break;
    case "null":
      label = "Null";
      color = "gray";
      border = true;
      children = <span class="font-bold italic text-gray-500">null</span>;
      break;
    case "number":
      label = "Number";
      color = "purple";
      children = String(value.value);
      break;
    case "object":
      label = "JSON";
      color = "blue";
      children = (
        <pre><code>{JSON.stringify(value.value, undefined, "  ")}</code></pre>
      );
      break;
    case "string":
      label = "String";
      color = "blue";
      children = <pre><code>{value.value}</code></pre>;
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
      <div class="rounded p-1 bg-gray(100 dark:800) max-h-64 lg:max-h-96 overflow-y-auto overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
