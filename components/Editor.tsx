import { type ComponentChildren, type JSX } from "preact";
import { useEffect } from "preact/hooks";
import { type Signal, useComputed, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { tw } from "twind";
import { css } from "twind/css";

interface Record {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export interface EditorProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onKeyDown"> {
  highlight(value: string): string;
  insertSpaces?: boolean;
  ignoreTabKey?: boolean;
  tabSize?: number;
  class?: string;

  // TextArea Attributes
  autofocus?: boolean | undefined | JSX.SignalLike<boolean | undefined>;
  autoFocus?: boolean | undefined | JSX.SignalLike<boolean | undefined>;
  disabled?: boolean | undefined | JSX.SignalLike<boolean | undefined>;
  form?: string | undefined | JSX.SignalLike<string | undefined>;
  maxLength?: number | undefined | JSX.SignalLike<number | undefined>;
  maxlength?: number | undefined | JSX.SignalLike<number | undefined>;
  name?: string | undefined | JSX.SignalLike<string | undefined>;
  placeholder?: string | undefined | JSX.SignalLike<string | undefined>;
  readonly?: boolean | undefined | JSX.SignalLike<boolean | undefined>;
  readOnly?: boolean | undefined | JSX.SignalLike<boolean | undefined>;
  required?: boolean;
  rows?: number | undefined | JSX.SignalLike<number | undefined>;
  value?:
    | string
    | JSX.SignalLike<string | undefined>;
  onKeyDown?:
    | JSX.KeyboardEventHandler<HTMLTextAreaElement>
    | undefined;
}

const HISTORY_LIMIT = 100;
const HISTORY_TIME_GAP = 3000;
const RE_LAST_WORD = /[^a-z0-9]([a-z0-9]+)$/i;

const IS_MAC_LIKE = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
const IS_WINDOWS = /Win/i.test(navigator.platform);

const containerCss = css({
  position: "relative",
  textAlign: "left",
  boxSizing: "border-box",
  padding: 0,
  overflow: "hidden",
});

const editorCss = css({
  margin: 0,
  border: 0,
  background: "none",
  boxSizing: "inherit",
  display: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontStyle: "inherit",
  fontVariantLigatures: "inherit",
  fontWeight: "inherit",
  letterSpacing: "inherit",
  lineHeight: "inherit",
  tabSize: "inherit",
  textIndent: "inherit",
  textRendering: "inherit",
  textTransform: "inherit",
  whiteSpace: "pre-wrap",
  wordBreak: "keep-all",
  overflowWrap: "break-word",
});

const highlightCss = css({
  position: "relative",
  pointerEvents: "none",
  padding: "0.5rem",
});

const textAreaCss = css({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  resize: "none",
  color: "inherit",
  overflow: "hidden",
  padding: "0.5rem",
  WebkitTextFillColor: "transparent",
  "&:placeholder-shown": {
    WebkitTextFillColor: "inherit !important",
  },
});

function isSignalLike<T>(value: unknown): value is JSX.SignalLike<T> {
  return !!(value && typeof value === "object" && "value" in value &&
    "peek" in value && typeof value.peek === "function" &&
    "subscribe" in value && typeof value.subscribe === "function");
}

function getLines(text: string, position: number) {
  return text.substring(0, position).split("\n");
}

function Highlighted({ value }: { value: Signal<ComponentChildren> }) {
  return (
    <pre
      aria-hidden="true"
      {...(typeof value.value === "string"
        ? { dangerouslySetInnerHTML: { __html: `${value.value}<br />` } }
        : { children: value })}
      class={tw`${editorCss} ${highlightCss}`}
    />
  );
}

export function Editor(
  {
    value = "",
    highlight,
    insertSpaces = true,
    ignoreTabKey = false,
    class: className = "",
    tabSize = 2,
    autofocus,
    autoFocus,
    disabled,
    form,
    maxlength,
    maxLength,
    name,
    id,
    placeholder,
    readonly,
    readOnly,
    required,
    rows,
    onKeyDown,
    ...props
  }: EditorProps,
) {
  const textAreaProps = {
    autoFocus,
    autofocus,
    disabled,
    form,
    maxLength,
    maxlength,
    name,
    id,
    placeholder,
    readOnly,
    readonly,
    required,
    rows,
  };

  const valueSignal = isSignalLike(value) ? value : useSignal(value);
  const highlighted = useComputed(() => highlight(valueSignal.value ?? ""));
  const capture = useSignal(false);
  const tabCharacter = (insertSpaces ? " " : "\t").repeat(tabSize);
  const stack = useSignal<(Record & { timestamp: number })[]>([]);
  const offset = useSignal(-1);
  const textArea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textArea.current) {
      return;
    }

    const { value, selectionStart, selectionEnd } = textArea.current;

    recordChange({ value, selectionStart, selectionEnd });
  });

  function recordChange(record: Record, overwrite = false) {
    if (stack.value.length && offset.value > -1) {
      stack.value = stack.value.slice(0, offset.value + 1);
      const count = stack.value.length;

      if (count > HISTORY_LIMIT) {
        const extras = count - HISTORY_LIMIT;
        stack.value = stack.value.slice(extras, count);
        offset.value = Math.max(offset.value - extras, 0);
      }
    }

    const timestamp = Date.now();

    if (overwrite) {
      const last = stack.value[offset.value];

      if (last && timestamp - last.timestamp < HISTORY_TIME_GAP) {
        const previous = getLines(last.value, last.selectionStart)
          .pop()?.match(RE_LAST_WORD);
        const current = getLines(record.value, record.selectionStart)
          .pop()?.match(RE_LAST_WORD);

        if (previous?.[1] && current?.[1]?.startsWith(previous[1])) {
          stack.value = [
            ...stack.value.slice(0, offset.value),
            { ...record, timestamp },
            ...stack.value.slice(offset.value + 1),
          ];
        }
        return;
      }
    }

    stack.value = [...stack.value, { ...record, timestamp }];
    offset.value++;
  }

  function updateInput(record: Record) {
    if (!textArea.current) {
      return;
    }

    textArea.current.value = record.value;
    valueSignal.value = record.value;
    textArea.current.selectionStart = record.selectionStart;
    textArea.current.selectionEnd = record.selectionEnd;
  }

  function applyEdits(record: Record) {
    const last = stack.value[offset.value];

    if (last && textArea.current) {
      stack.value[offset.value] = {
        ...last,
        selectionStart: textArea.current.selectionStart,
        selectionEnd: textArea.current.selectionEnd,
      };
    }

    recordChange(record);
    updateInput(record);
  }

  function undoEdit() {
    const record = stack.value[offset.value - 1];

    if (record) {
      updateInput(record);
      offset.value = Math.max(offset.value - 1, 0);
    }
  }

  function redoEdit() {
    const record = stack.value[offset.value + 1];

    if (record) {
      updateInput(record);
      offset.value = Math.min(offset.value + 1, stack.value.length - 1);
    }
  }

  const handleInput: JSX.GenericEventHandler<HTMLTextAreaElement> = (evt) => {
    const { value, selectionStart, selectionEnd } = evt.currentTarget;
    valueSignal.value = value;
    recordChange({ value, selectionStart, selectionEnd }, true);
  };

  const handleKeyDown: JSX.KeyboardEventHandler<HTMLTextAreaElement> = (
    evt,
  ) => {
    if (onKeyDown) {
      onKeyDown(evt);

      if (evt.defaultPrevented) {
        return;
      }
    }

    if (evt.key === "Escape") {
      evt.currentTarget.blur();
    }

    const { value, selectionStart, selectionEnd } = evt.currentTarget;

    if (evt.key === "Tab" && !ignoreTabKey && capture.value) {
      evt.preventDefault();

      if (evt.shiftKey) {
        const linesBeforeCaret = getLines(value, selectionStart);
        const startLine = linesBeforeCaret.length - 1;
        const endLine = getLines(value, selectionEnd).length - 1;
        const nextValue = value
          .split("\n")
          .map((line, i) => {
            if (
              i >= startLine && i <= endLine && line.startsWith(tabCharacter)
            ) {
              return line.substring(tabCharacter.length);
            }
            return line;
          })
          .join("\n");

        if (value !== nextValue) {
          const startLineText = linesBeforeCaret[startLine];

          applyEdits({
            value: nextValue,
            selectionStart: startLineText?.startsWith(tabCharacter)
              ? selectionStart - tabCharacter.length
              : selectionStart,
            selectionEnd: selectionEnd - (value.length - nextValue.length),
          });
        }
      } else if (selectionStart !== selectionEnd) {
        const linesBeforeCaret = getLines(value, selectionStart);
        const startLine = linesBeforeCaret.length - 1;
        const endLine = getLines(value, selectionEnd).length - 1;
        const startLineText = linesBeforeCaret[startLine];

        applyEdits({
          value: value
            .split("\n")
            .map((line, i) =>
              i >= startLine && i <= endLine ? `${tabCharacter}${line}` : line
            )
            .join("\n"),
          selectionStart: startLineText && /\S/.test(startLineText)
            ? selectionStart + tabCharacter.length
            : selectionStart,
          selectionEnd: selectionEnd +
            tabCharacter.length * (endLine - startLine + 1),
        });
      } else {
        const updatedSelection = selectionStart + tabCharacter.length;

        applyEdits({
          value: `${value.substring(0, selectionStart)}${tabCharacter}${
            value.substring(selectionEnd)
          }`,
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection,
        });
      }
    } else if (evt.key === "Backspace") {
      const hasSelection = selectionStart !== selectionEnd;
      const textBeforeCaret = value.substring(0, selectionStart);

      if (textBeforeCaret.endsWith(tabCharacter) && !hasSelection) {
        evt.preventDefault();
        const updatedSelection = selectionStart - tabCharacter.length;
        applyEdits({
          value: `${value.substring(0, selectionStart - tabCharacter.length)}${
            value.substring(selectionEnd)
          }`,
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection,
        });
      }
    } else if (evt.key === "Enter") {
      if (selectionStart === selectionEnd) {
        const line = getLines(value, selectionStart).pop();
        const matches = line?.match(/^\s+/);

        if (matches?.[0]) {
          evt.preventDefault();
          const indent = `\n${matches[0]}`;
          const updatedSelection = selectionStart + indent.length;

          applyEdits({
            value: `${value.substring(0, selectionStart)}${indent}${
              value.substring(selectionEnd)
            }`,
            selectionStart: updatedSelection,
            selectionEnd: updatedSelection,
          });
        }
      }
    } else if (
      evt.code === "BracketLeft" || evt.key === "(" || evt.code === "Quote" ||
      evt.code === "Backquote"
    ) {
      let chars: [string, string] | undefined;

      if (evt.key === "(") {
        chars = ["(", ")"];
      } else if (evt.code === "BracketLeft") {
        if (evt.shiftKey) {
          chars = ["{", "}"];
        } else {
          chars = ["[", "]"];
        }
      } else if (evt.code === "Quote") {
        if (evt.shiftKey) {
          chars = ['"', '"'];
        } else {
          chars = ["'", "'"];
        }
      } else if (evt.code === "Backquote") {
        chars = ["`", "`"];
      }

      if (selectionStart !== selectionEnd && chars) {
        evt.preventDefault();

        applyEdits({
          value: `${value.substring(0, selectionStart)}${chars[0]}${
            value.substring(selectionStart, selectionEnd)
          }${chars[1]}${value.substring(selectionEnd)}`,
          selectionStart,
          selectionEnd: selectionEnd + 2,
        });
      }
    } else if (
      (IS_MAC_LIKE
        ? evt.metaKey && evt.key === "z"
        : evt.ctrlKey && evt.key === "z") && !evt.shiftKey && !evt.altKey
    ) {
      evt.preventDefault();

      undoEdit();
    } else if (
      (IS_MAC_LIKE
        ? evt.metaKey && evt.key === "z" && evt.shiftKey
        : IS_WINDOWS
        ? evt.ctrlKey && evt.key === "y"
        : evt.ctrlKey && evt.key === "z" && evt.shiftKey) && !evt.altKey
    ) {
      evt.preventDefault();

      redoEdit();
    } else if (
      evt.key === "m" && evt.ctrlKey && (IS_MAC_LIKE ? evt.shiftKey : true)
    ) {
      evt.preventDefault();

      capture.value = !capture.value;
    }
  };

  return (
    <div {...props} class={tw`${containerCss} font-mono ${className}`}>
      <textarea
        ref={textArea}
        value={value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        {...textAreaProps}
        class={tw`${textAreaCss} ${editorCss}`}
      >
      </textarea>
      <Highlighted value={highlighted}></Highlighted>
    </div>
  );
}
