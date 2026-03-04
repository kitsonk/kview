// deno-lint-ignore-file react-no-danger
import type { KvArrayBufferJSON, KvDataViewJSON, KvTypedArrayJSON } from "@deno/kv-utils/json";
import { type Signal, useSignal } from "@preact/signals";
import { decodeBase64Url } from "@std/encoding/base64url";

interface Index {
  row: number;
  col: number;
}

const DISPLAY_COLS = 16;

function toDisplay(value: number): string {
  return value > 0x1f && value < 0x7f ? value === 0x20 ? "&nbsp;" : String.fromCharCode(value) : ".";
}

function integerToHexAndText(value: Uint8Array): { hex: string[]; str: string[] } {
  const hex: string[] = [];
  const str: string[] = [];

  for (let i = 0; i < value.length; i++) {
    const u8 = value[i];
    const hexValue = u8.toString(16).padStart(2, "0");
    const char = toDisplay(u8);
    hex.push(hexValue);
    str.push(char);
  }
  return { hex, str };
}

function prepareRows(arr: string[]) {
  return Array.from(
    { length: Math.ceil(arr.length / DISPLAY_COLS) },
    (_v, i) => arr.slice(i * DISPLAY_COLS, i * DISPLAY_COLS + DISPLAY_COLS),
  );
}

function hexCounter(length: number, padLength: number, increment: number): string[] {
  let hexIndex = 0;
  return Array.from({ length }, () => {
    const el = hexIndex.toString(16).padStart(padLength, "0");
    hexIndex += increment;
    return el;
  });
}

function base64ToData(value: string) {
  const data = decodeBase64Url(value);
  const { hex, str } = integerToHexAndText(data);
  const hexRows = prepareRows(hex);
  if (hexRows[0].length < DISPLAY_COLS) {
    const start = hexRows[0].length;
    hexRows[0].length = DISPLAY_COLS;
    hexRows[0].fill("&nbsp;&nbsp;", start);
  }
  const textRows = prepareRows(str);
  const outputRows = hexRows.length;
  const rowCounter = hexCounter(outputRows, 8, 16);
  const colCounter = hexCounter(DISPLAY_COLS, 2, 1);
  return { hexRows, textRows, rowCounter, colCounter };
}

function Columns({ data, highlight }: { data: string[]; highlight: Signal<Index | undefined> }) {
  const highlightValue = highlight.value;
  const highlightCol = highlightValue?.col ?? -1;
  return (
    <div class="flex flex-row bg-neutral text-neutral-content">
      <div class="lg:px-2 lg:py-1 select-none">
        00000000
      </div>
      <div class="lg:px-2 lg:py-1 min-w-96">
        <div class="flex flex-row text-center">
          {data.map((col, i) => (
            <div
              key={i}
              class={highlightCol === i ? "rounded-sm bg-base-100 text-base-content font-bold px-1" : "px-1"}
            >
              {col}
            </div>
          ))}
        </div>
      </div>
      <div class="px-2 py-1 min-w-64"></div>
    </div>
  );
}

function Rows({ data, highlight }: { data: string[]; highlight: Signal<Index | undefined> }) {
  const highlightValue = highlight.value;
  const highlightRow = highlightValue?.row ?? -1;
  return (
    <div class="lg:px-2 lg:py-1 bg-base-300 text-base-content select-none">
      <div class="flex flex-row">
        <div class="flex-auto text-center">
          {data.map((row, i) => (
            <pre
              key={i}
              class={highlightRow === i ? "rounded-sm bg-neutral text-neutral-content font-bold" : undefined}
            >{row}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentHex({ data, highlight }: { data: string[][]; highlight: Signal<Index | undefined> }) {
  const highlightValue = highlight.value;
  const { row: highlightRow = -1, col: highlightCol = -1 } = highlightValue ?? {};

  function isHighlighted(row: number, col: number) {
    return highlightRow === row && highlightCol === col;
  }

  return (
    <div class="px-2 py-1 min-w-96 bg-base-100 text-base-content">
      {data.map((row, i) => (
        <div key={i} class="flex flex-row text-center">
          {row.map((cell, j) => (
            <div
              key={j}
              class={isHighlighted(i, j) ? "rounded-sm bg-primary text-primary-content px-1" : "px-1"}
              onMouseEnter={() => highlight.value = { row: i, col: j }}
              onMouseLeave={() => highlight.value = undefined}
              dangerouslySetInnerHTML={{ __html: cell }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ContentText({ data, highlight }: { data: string[][]; highlight: Signal<Index | undefined> }) {
  const highlightValue = highlight.value;
  const { row: highlightRow = -1, col: highlightCol = -1 } = highlightValue ?? {};

  function isHighlighted(row: number, col: number) {
    return highlightRow === row && highlightCol === col;
  }

  return (
    <div class="px-2 py-1 min-w-64 bg-base-100 text-base-content font-mono">
      {data.map((row, i) => (
        <div key={i} class="flex flex-row text-center">
          {row.map((cell, j) => (
            <div
              key={j}
              class={isHighlighted(i, j) ? "rounded-sm bg-primary text-primary-content px-1" : "px-1"}
              onMouseEnter={() => highlight.value = { row: i, col: j }}
              onMouseLeave={() => highlight.value = undefined}
              dangerouslySetInnerHTML={{ __html: cell }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ValueBinary({ value }: { value: KvTypedArrayJSON | KvArrayBufferJSON | KvDataViewJSON }) {
  const highlight = useSignal<Index | undefined>(undefined);
  const data = base64ToData(value.value);
  return (
    <div class="bg-base-100 border-base-300 rounded-field border overflow-x-auto max-h-96 font-mono w-full">
      <div class="min-w-max">
        <Columns data={data.colCounter} highlight={highlight} />
        <div class="flex flex-row bg-base-200">
          <Rows data={data.rowCounter} highlight={highlight} />
          <ContentHex data={data.hexRows} highlight={highlight} />
          <ContentText data={data.textRows} highlight={highlight} />
        </div>
      </div>
    </div>
  );
}
