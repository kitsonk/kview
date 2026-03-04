// deno-lint-ignore-file react-no-danger

import type { KvMapJSON } from "@deno/kv-utils/json";
import { highlightJSON } from "@/utils/highlight.ts";

export function ValueMap({ value }: { value: KvMapJSON }) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96">
      <table class="table table-pin-rows table-sm table-fixed w-full">
        <thead>
          <tr>
            <th class="w-1/3">Key</th>
            <th class="w-2/3">Value</th>
          </tr>
        </thead>
        <tbody>
          {value.value.map(([key, value]) => (
            <tr>
              <td>
                <pre><code class="overflow-hidden text-ellipsis" dangerouslySetInnerHTML={{ __html: highlightJSON(key) }} /></pre>
              </td>
              <td>
                <pre><code class="overflow-hidden text-ellipsis" dangerouslySetInnerHTML={{ __html: highlightJSON(value) }} /></pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
