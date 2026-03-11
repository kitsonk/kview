import type { KvErrorJSON } from "@deno/kv-utils/json";

export function ValueError({ value }: { value: KvErrorJSON }) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96">
      <table class="table table-sm table-fixed w-full">
        <tbody>
          <tr>
            <th class="w-24">Message</th>
            <td>{value.value.message}</td>
          </tr>
          <tr>
            <th class="w-24">Stack</th>
            <td>
              <pre class="overflow-hidden text-ellipsis">{value.value.stack}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
