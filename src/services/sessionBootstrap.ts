import { IUser } from "../reducers";
import { userHistoryApi, userProfileApi } from "../tools/api";

export type SessionBootstrapResult = {
  isLoaded: boolean;
  profileError: boolean;
  historyError: boolean;
}

type IHistoryResponse = {
  id: number;
  moves: unknown[];
}

type SessionBootstrapDeps = {
  fetchImpl?: typeof fetch;
  dispatch: (action: unknown) => void;
  connect: (token: string) => void;
}

/**
 * Deep module seam for session startup.
 * Callers only ask for bootstrap result; implementation details stay local.
 */
export async function bootstrapSession(
  token: string | null,
  deps: SessionBootstrapDeps
): Promise<SessionBootstrapResult> {
  if (!token) {
    return {
      isLoaded: true,
      profileError: false,
      historyError: false,
    };
  }

  const fetchImpl = deps.fetchImpl || fetch;
  const profileResult = await fetchProfile(token, fetchImpl);
  if (profileResult.isError || !profileResult.response) {
    return {
      isLoaded: true,
      profileError: true,
      historyError: false,
    };
  }

  const historyResult = await fetchHistory(token, fetchImpl);
  if (historyResult.isError || !historyResult.response) {
    return {
      isLoaded: true,
      profileError: false,
      historyError: true,
    };
  }

  const userExtended: IUser = {
    ...profileResult.response,
    isLoggedIn: true,
    lastGameId: historyResult.response.id,
  };

  deps.dispatch({
    type: "SET_HISTORY",
    payload: historyResult.response.moves,
  });
  deps.dispatch({
    type: "USER_SIGN_IN",
    payload: userExtended,
  });
  deps.connect(token);

  return {
    isLoaded: true,
    profileError: false,
    historyError: false,
  };
}

async function fetchProfile(token: string, fetchImpl: typeof fetch) {
  const api = userProfileApi(token);
  try {
    const response = await fetchImpl(api.url, api.requestInit);
    if (!response.ok) {
      return { isError: true, response: null };
    }
    const json = (await response.json()) as IUser;
    return { isError: false, response: json };
  } catch (e) {
    return { isError: true, response: null };
  }
}

async function fetchHistory(token: string, fetchImpl: typeof fetch) {
  const api = userHistoryApi(token);
  try {
    const response = await fetchImpl(api.url, api.requestInit);
    if (!response.ok) {
      return { isError: true, response: null };
    }
    const json = (await response.json()) as IHistoryResponse;
    return { isError: false, response: json };
  } catch (e) {
    return { isError: true, response: null };
  }
}
