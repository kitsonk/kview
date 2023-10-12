import { signal } from "@preact/signals";

function createAppState() {
  const accessToken = signal("");

  return { accessToken };
}

export const state = createAppState();
