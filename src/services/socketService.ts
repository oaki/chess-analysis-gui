import SocketManager from "./socketManager";
import config from "../config";
import store from "../store";

export const SocketManagerService = new SocketManager(config, store);