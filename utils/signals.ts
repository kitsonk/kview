import { type JSX } from "preact";
import { useSignal } from "@preact/signals";

export type MaybeSignalish<T> = T | undefined | JSX.SignalLike<T | undefined>;

export function isSignalLike<T>(value: unknown): value is JSX.SignalLike<T> {
  return !!(value && typeof value === "object" && "value" in value &&
    "peek" in value && typeof value.peek === "function" &&
    "subscribe" in value && typeof value.subscribe === "function");
}

export function asSignal<T>(value: JSX.Signalish<T>): JSX.SignalLike<T> {
  // deno-lint-ignore react-rules-of-hooks
  return isSignalLike(value) ? value : useSignal(value);
}
