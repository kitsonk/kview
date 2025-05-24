// deno-lint-ignore-file react-no-danger
import { type Signal, useSignal } from "@preact/signals";
import { decodeBase64Url } from "@std/encoding/base64url";

interface Index {
  row: number;
  col: number;
}

interface Data {
  textRows: string[][];
  hexRows: string[][];
  rowCounter: string[];
  colCounter: string[];
}

const VIEWER_COLUMNS = 16;

function toDisplay(value: number): string {
  return value > 0x1f && value < 0x7f ? value === 0x20 ? "&nbsp;" : String.fromCharCode(value) : ".";
}

function prepareRows(arr: string[]) {
  return Array.from(
    { length: Math.ceil(arr.length / VIEWER_COLUMNS) },
    (_v, i) => arr.slice(i * VIEWER_COLUMNS, i * VIEWER_COLUMNS + VIEWER_COLUMNS),
  );
}

function integerToHexAndText(
  value: Uint8Array,
): { hex: string[]; str: string[] } {
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

function hexCounter(
  length: number,
  padLength: number,
  increment: number,
): string[] {
  let hexIndex = 0;
  return Array.from({ length }, () => {
    const el = hexIndex.toString(16).padStart(padLength, "0");
    hexIndex += increment;
    return el;
  });
}

function base64ToData(value: string): Data {
  const data = decodeBase64Url(value);
  const { hex, str } = integerToHexAndText(data);
  const hexRows = prepareRows(hex);
  if (hexRows[0].length < VIEWER_COLUMNS) {
    const start = hexRows[0].length;
    hexRows[0].length = VIEWER_COLUMNS;
    hexRows[0].fill("&nbsp;&nbsp;", start);
  }
  const textRows = prepareRows(str);
  const outputRows = hexRows.length;
  const rowCounter = hexCounter(outputRows, 8, 16);
  const colCounter = hexCounter(VIEWER_COLUMNS, 2, 1);
  return { hexRows, textRows, rowCounter, colCounter };
}

function ColumnCounter(
  { data, highlight }: { data: string[]; highlight: Signal<Index | undefined> },
) {
  const highlightValue = highlight.value;
  return (
    <div class="flex flex-row bg-primary-700 text-primary-100 dark:bg-primary-300 dark:text-primary-900 rounded-t-lg">
      <div class="lg:px-2 lg:py-1 text-primary-700 dark:text-primary-300 select-none">
        00000000
      </div>
      <div class="lg:px-2 lg:py-1 min-w-108">
        <div class="flex flex-row text-center">
          {data.map((col, i) => (
            <div
              key={i}
              class={highlightValue?.col === i ? "rounded-sm bg-primary-200 font-bold px-1" : "px-1"}
            >
              {col}
            </div>
          ))}
        </div>
      </div>
      <div class="px-2 py-1 min-w-72"></div>
    </div>
  );
}

function RowCounter(
  { data, highlight }: { data: string[]; highlight: Signal<Index | undefined> },
) {
  const highlightValue = highlight.value;
  return (
    <div class="lg:px-2 lg:py-1 bg-primary-800 text-primary-100 dark:bg-primary-200 dark:text-primary-900">
      <div class="flex flex-row">
        <div class="flex-auto text-center">
          {data.map((row, i) => (
            <pre
              key={i}
              class={highlightValue?.row === i ? "rounded-sm bg-primary-300 font-bold" : undefined}
            >{row}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}

function HexViewerContent(
  { type, data, highlight }: {
    type: "hex" | "text";
    data: string[][];
    highlight: Signal<Index | undefined>;
  },
) {
  const highlightValue = highlight.value;

  function isHighlighted(i: number, j: number) {
    return highlightValue?.row === i && highlightValue?.col === j;
  }

  return (
    <div
      class={`px-2 py-1 ${type === "hex" ? "min-w-108" : "min-w-72"} bg-gray-100 dark:bg-gray-800 dark:text-white`}
    >
      {data.map((row, i) => (
        <div key={i} class="flex flex-row text-center">
          {row.map((cell, j) => (
            <div
              key={j}
              class={isHighlighted(i, j) ? "rounded-sm bg-white text-black px-1" : "px-1"}
              dangerouslySetInnerHTML={{ __html: cell }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HexViewer(
  { value, class: className = "" }: { value: string; class?: string },
) {
  const highlight = useSignal<Index | undefined>(undefined);
  const data = base64ToData(value);
  return (
    <div
      class={`rounded-lg text-xs sm:text-sm lg:text-base font-mono ${className}`}
    >
      <ColumnCounter data={data.colCounter} highlight={highlight} />
      <div className="h-full flex flex-row bg-gray-800 overflow-y-auto">
        <RowCounter data={data.rowCounter} highlight={highlight} />
        <HexViewerContent
          type="hex"
          data={data.hexRows}
          highlight={highlight}
        />
        <HexViewerContent
          type="text"
          data={data.textRows}
          highlight={highlight}
        />
      </div>
    </div>
  );
}
