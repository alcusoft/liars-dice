import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore, type StateCreator } from "zustand/vanilla";

/** Represents an initializer passed to {@link createEnhancedStore} */
type StateInitializer<T> = StateCreator<
  T,
  [["zustand/subscribeWithSelector", never], ["zustand/immer", never]]
>;

/**
 * Creates an enhanced Zustand store with subscription and Immer middleware.
 * @param initializer The state initializer for the store.
 * @returns An enhanced store instance.
 */
export const createEnhancedStore = <T>(initializer: StateInitializer<T>) => {
  // Compose middleware: subscribeWithSelector -> immer -> createStore
  const composedInitializer = subscribeWithSelector(immer(initializer));
  return createStore(composedInitializer);
};
