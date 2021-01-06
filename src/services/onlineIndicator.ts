import store from "../store";
import { IS_ONLINE } from "reducers";
import "../assets/css/onMoveIndicator.css";

export function setIsOnline(isOnline: boolean) {
  return {
    payload: !!isOnline,
    type: IS_ONLINE
  };
}

export default function onlineIndicator() {
  store.dispatch(setIsOnline(true));

  window.addEventListener("offline", () => {
    store.dispatch(setIsOnline(false));
  });

  window.addEventListener("online", () => {
    store.dispatch(setIsOnline(true));
  });
}

export type IIsOnline = {
  isOnline: boolean;
}
