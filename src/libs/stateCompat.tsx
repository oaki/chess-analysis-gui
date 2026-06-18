import React, { type ComponentType } from "react";
import { store, useAppStore } from "../store";
import type { ReduxStateShape } from "../reducers";

type EqualityFn<T> = (a: T, b: T) => boolean;

export function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (!a || !b || typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) {
    return false;
  }
  const ao = a as Record<string, unknown>;
  const bo = b as Record<string, unknown>;
  for (let i = 0; i < keysA.length; i += 1) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(bo, key) || !Object.is(ao[key], bo[key])) {
      return false;
    }
  }
  return true;
}

export function useSelector<T>(
  selector: (state: ReduxStateShape) => T,
  equalityFn?: EqualityFn<T>
): T {
  const slice = equalityFn ? useAppStore(selector, equalityFn) : useAppStore(selector);
  return slice as T;
}

export function useDispatch() {
  return store.dispatch;
}

type MapDispatchObject = Record<string, (...args: unknown[]) => unknown>;

export function connect(
  mapStateToProps?: (state: ReduxStateShape, ownProps?: Record<string, unknown>) => Record<string, unknown>,
  mapDispatchToProps?: MapDispatchObject | ((dispatch: typeof store.dispatch, ownProps?: Record<string, unknown>) => Record<string, unknown>)
) {
  return function wrap<P extends Record<string, unknown>>(WrappedComponent: ComponentType<P>) {
    return function ConnectedComponent(ownProps: P) {
      const stateProps = useSelector(
        (state) => (mapStateToProps ? mapStateToProps(state, ownProps) : {}),
        shallowEqual
      ) as Record<string, unknown>;
      let dispatchProps: Record<string, unknown> = { dispatch: store.dispatch };
      if (typeof mapDispatchToProps === "function") {
        dispatchProps = mapDispatchToProps(store.dispatch, ownProps);
      } else if (mapDispatchToProps && typeof mapDispatchToProps === "object") {
        const creators = mapDispatchToProps as MapDispatchObject;
        dispatchProps = Object.keys(creators).reduce<MapDispatchObject>((acc, key) => {
          acc[key] = (...args: unknown[]) => store.dispatch(creators[key](...args));
          return acc;
        }, {});
      }
      const merged = { ...ownProps, ...stateProps, ...dispatchProps } as P;
      return <WrappedComponent {...merged} />;
    };
  };
}
