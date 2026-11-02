import type { CloneableErrorTypes, KvErrorJSON, KvValueJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";
import { toErrorParts } from "@/utils/kv_json.ts";

import { ValueEditor } from "./ValueEditor.tsx";

export function ErrorValueEditor(
  { errorType, value, onChange }: {
    errorType: CloneableErrorTypes;
    value?: KvValueJSON;
    onChange?: (value: KvErrorJSON) => void;
  },
) {
  const valueParts = useSignal(toErrorParts(value));
  useSignalEffect(() => {
    if (onChange) {
      onChange({
        type: errorType,
        value: {
          message: valueParts.value.message,
          stack: valueParts.value.stack,
          cause: valueParts.value.cause,
        },
      });
    }
  });
  return (
    <div class="space-y-2">
      <label class="input w-full">
        <span class="iconify lucide--triangle-alert h-[1em] opacity-50"></span>
        <input
          type="text"
          name="valueMessage"
          value={valueParts.value.message}
          placeholder="Error message"
          required
          onInput={(evt) => valueParts.value = { ...valueParts.value, message: evt.currentTarget.value }}
        />
      </label>
      <textarea
        class="textarea w-full"
        name="valueStack"
        value={valueParts.value.stack}
        placeholder="Error stack"
        onInput={(evt) => valueParts.value = { ...valueParts.value, stack: evt.currentTarget.value }}
      />
      {valueParts.value.cause
        ? (
          <ValueEditor
            key="cause"
            label="Cause"
            value={valueParts.value.cause}
            onChange={(newCause) => {
              if (newCause) {
                valueParts.value = { ...valueParts.value, cause: newCause };
              }
            }}
            onDelete={() => valueParts.value = { ...valueParts.value, cause: undefined }}
          />
        )
        : (
          <button
            type="button"
            class="btn btn-sm btn-block"
            onClick={() =>
              valueParts.value = {
                ...valueParts.value,
                cause: { type: "string", value: "" },
              }}
          >
            <span class="iconify lucide--plus"></span> Add Cause
          </button>
        )}
    </div>
  );
}
