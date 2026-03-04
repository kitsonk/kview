// deno-lint-ignore-file react-no-danger

import type { KvSetJSON } from "@deno/kv-utils/json";
import { highlightJSON } from "@/utils/highlight.ts";

export function ValueSet({ value }: { value: KvSetJSON }) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96">
      <table class="table table-pin-rows table-sm table-fixed w-full">
        <thead>
          <tr>
            <th class="w-full">Item</th>
          </tr>
        </thead>
        <tbody>
          {value.value.map((item) => (
            <tr>
              <td>
                <pre><code class="overflow-hidden text-ellipsis" dangerouslySetInnerHTML={{ __html: highlightJSON(item) }} /></pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
