import { useEffect, useState } from "react";
import { SessionBootstrapResult, bootstrapSession } from "../services/sessionBootstrap";

const initialState: SessionBootstrapResult = {
  isLoaded: false,
  profileError: false,
  historyError: false,
};

type UseSessionBootstrapDeps = {
  token: string | null;
  dispatch: (action: unknown) => void;
  connect: (token: string) => void;
}

export function useSessionBootstrap(
  deps: UseSessionBootstrapDeps
): SessionBootstrapResult {
  const [state, setState] = useState<SessionBootstrapResult>(initialState);

  useEffect(() => {
    let active = true;

    bootstrapSession(deps.token, {
      dispatch: deps.dispatch,
      connect: deps.connect,
    }).then((result) => {
      if (active) {
        setState(result);
      }
    });

    return () => {
      active = false;
    };
  }, [deps.connect, deps.dispatch, deps.token]);

  return state;
}
