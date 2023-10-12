import { type KvValueJSON } from "$utils/kv.ts";

export function KvValue({ value }: { value: KvValueJSON }) {
  let color;
  let label;
  let children;

  switch (value.type) {
    case "KvU64":
      label = "Deno.KvU64";
      color = "pink";
      children = value.value;
      break;
    case "Map":
      label = "Map";
      color = "red";
      children = (
        <pre><code>{JSON.stringify(value.value, undefined, "  ")}</code></pre>
      );
      break;
    case "RegExp":
      label = "RegExp";
      color = "yellow";
      children = value.value;
      break;
    case "Set":
      label = "Set";
      color = "red";
      children = (
        <pre><code>{JSON.stringify(value.value, undefined, "  ")}</code></pre>
      );
      break;
    case "Uint8Array":
      label = "Uint8Array";
      color = "gray";
      children = value.value;
      break;
    case "bigint":
      label = "BigInt";
      color = "indigo";
      children = `${value.value}n`;
      break;
    case "boolean":
      label = "Boolean";
      color = "green";
      children = String(value.value);
      break;
    case "null":
      label = "Null";
      color = "gray";
      children = <pre><code>null</code></pre>;
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
      children = <pre><code>value.value</code></pre>;
  }

  return (
    <div>
      <h2 class="font-bold my-2">Type</h2>
      <div>
        <div
          class={`bg-${color}-100 text-${color}-800 px-2.5 py-0.5 m-1 inline-block rounded dark:(bg-${color}-900 text-${color}-300)`}
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
