import { createDefine } from "fresh";

export interface State {
  currentKvStoreId?: string;
  sessionToken?: string;
}

export const define = createDefine<State>();
