import type { KvFilterJSON } from "@kitsonk/kv-toolbox/query";
import { useRef } from "preact/hooks";
import { type Signal, useComputed, useSignal } from "@preact/signals";
import { addNotification } from "$utils/state.ts";

import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { type KvFilterIndeterminateJSON, QueryFilter } from "./QueryFilter.tsx";
import IconPlus from "./icons/Plus.tsx";

export function DialogQuery(
  { open, filters, active }: {
    open: Signal<boolean>;
    filters: Signal<KvFilterJSON[]>;
    active: Signal<boolean>;
  },
) {
  const form = useRef<HTMLFormElement>(null);
  const localFilters = filters.peek().length
    ? useSignal<(KvFilterJSON | KvFilterIndeterminateJSON)[]>(
      [...filters.value],
    )
    : useSignal<(KvFilterJSON | KvFilterIndeterminateJSON)[]>([{ kind: "" }]);

  const handleFilterOnChange = (index: number, value: KvFilterJSON) =>
    localFilters.value = localFilters.value.map((filter, i) =>
      i === index ? value : filter
    );
  const handleFilterOnRemove = (index: number) =>
    localFilters.value = localFilters.value.filter((_, i) => i !== index);
  const handleAddOnClick = () => {
    localFilters.value = [...localFilters.value, { kind: "" }];
  };
  const filterComponents = useComputed(() =>
    localFilters.value.map((filter, index) => (
      <QueryFilter
        key={index}
        index={index}
        id={String(index)}
        filter={filter}
        onChange={handleFilterOnChange}
        onRemove={handleFilterOnRemove}
      />
    ))
  );
  return (
    <Dialog
      class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
      open={open}
    >
      <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Filter
        </h3>
        <CloseButton
          onClick={() => {
            form.current?.reset();
            localFilters.value = filters.value.length
              ? [...filters.value]
              : [{ kind: "" }];
            open.value = false;
          }}
        />
      </div>
      <form
        method="dialog"
        ref={form}
        class="z-10 w-full max-w-screen-md space-y-3"
        onSubmit={(_) => {
          filters.value = localFilters.value.filter(
            (filter) => filter.kind !== "",
          );
          if (filters.value.length > 0) {
            active.value = true;
            addNotification("Filter applied", "success", true, 5);
          }
          open.value = false;
        }}
      >
        {filterComponents}
        <a
          href="#"
          class="flex items-center pb-2 text-sm font-medium border-b dark:border-gray-600 text-primary-600 dark:text-primary-500 hover:underline"
          onClick={handleAddOnClick}
        >
          <IconPlus />
          Add Condition
        </a>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
          >
            Apply
          </button>
          <button
            type="reset"
            class="py-2.5 px-5 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 text-sm font-medium text-gray-900 focus:outline-none rounded-lg hover:text-black focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:text-white"
            onClick={() => {
              form.current?.reset();
              localFilters.value = [{ kind: "" }];
              active.value = false;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                aria-hidden="true"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
            Clear all
          </button>
        </div>
      </form>
    </Dialog>
  );
}
