import { create } from "zustand";
import { applyReducerMap, reducerMap, ReduxStateShape, type UnknownAction } from "./reducers";

type Listener = () => void;
type Thunk = (
  dispatch: (action: unknown) => unknown,
  getState: () => ReduxStateShape
) => unknown;

const INIT_ACTION = { type: "@@INIT" };

function createInitialState(): ReduxStateShape {
  const nextState = {} as ReduxStateShape;
  Object.keys(reducerMap).forEach((key) => {
    const k = key as keyof ReduxStateShape;
    (nextState as Record<keyof ReduxStateShape, unknown>)[k] = reducerMap[key](undefined, INIT_ACTION);
  });
  return nextState;
}

const listeners = new Set<Listener>();

export const useAppStore = create<ReduxStateShape>(() => createInitialState());

function notifySubscribers() {
  listeners.forEach((listener) => listener());
}

function applyAction(action: unknown) {
  useAppStore.setState((state) => applyReducerMap(state, action as UnknownAction));
  notifySubscribers();
  return action;
}

function dispatch(action: unknown): unknown {
  if (typeof action === "function") {
    return (action as Thunk)(dispatch, getState);
  }
  if (
    action &&
    typeof action === "object" &&
    "type" in action &&
    (action as BatchAction).type === "BATCH_ACTIONS" &&
    Array.isArray((action as BatchAction).payload)
  ) {
    (action as BatchAction).payload.forEach((singleAction) => {
      applyAction(singleAction);
    });
    return action;
  }
  return applyAction(action);
}

function getState(): ReduxStateShape {
  return useAppStore.getState();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const store = {
  dispatch,
  getState,
  subscribe,
};

export type BatchAction = {
  type: "BATCH_ACTIONS";
  payload: unknown[];
};