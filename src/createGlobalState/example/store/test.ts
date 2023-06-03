import { createGlobalState } from "@/createGlobalState/createGlobalState";

export const useTestStore = createGlobalState<string>('sdfs', 'test')