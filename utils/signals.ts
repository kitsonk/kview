import type { Signalish, SignalLike } from "preact";
import { useSignal } from "@preact/signals";

export function isSignalLike<T>(value: unknown): value is SignalLike<T> {
  return !!(value && typeof value === "object" && "value" in value &&
    "peek" in value && typeof value.peek === "function" &&
    "subscribe" in value && typeof value.subscribe === "function");
}

export function asSignal<T>(value: Signalish<T>): SignalLike<T> {
  // deno-lint-ignore react-rules-of-hooks
  return isSignalLike<T>(value) ? value : useSignal(value);
}

export function unwrap<T>(value: Signalish<T>): T {
  return isSignalLike<T>(value) ? value.value : value;
}

export function peek<T>(value: Signalish<T>): T {
  return isSignalLike<T>(value) ? value.peek() : value;
}
