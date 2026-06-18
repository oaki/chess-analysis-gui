import {IGameDatabase} from "components/gamesDatabaseExplorer/gamesDatabaseReducers";
import { IWorker } from "reducers";
import { IHistoryGameResponse } from "components/historyList/historyListReducers";
import type { IErrorProps } from "./services/errorManager";

export type Nullable<T> = T | null;
export type Undef<T> = T | undefined;
export enum LINE_MAP {
    mate = "m",
    score = "s",
    depth = "d",
    pv = "p",
    multipv = "u",
    nodes = "n",
    time = "t",
    nps = "c",
    tbhits = "h",
    import = "i",
    fen = "f",
}

export type IEvaluation = {
    [LINE_MAP.score]: string;
    [LINE_MAP.depth]: number;
    [LINE_MAP.pv]: string;
    [LINE_MAP.nodes]?: number;
    [LINE_MAP.time]?: string;
    [LINE_MAP.multipv]?: string;
    [LINE_MAP.nps]?: string;
    [LINE_MAP.tbhits]?: string;
    [LINE_MAP.import]?: number;
    [LINE_MAP.mate]?: boolean;
}

export type IWorkerResponse = IEvaluation & {
    fen: string;
}

export type IAction<TPayload> = {
    type: string;
    payload: TPayload;
}

export type IState = {
    loading: boolean;
    user: User;
    fen: string;
    evaluation: unknown[];
    openingMoves: OpeningMove[];
    errors: IErrorProps[];
    history: History[];
    status: string;
    isFlip: boolean;
    lastMoveId: number;
    lastMove: LastMove;
    menu: Menu;
    workers: IWorker[];
    onMove: number;
    historyList: IHistoryGameResponse[];
    syzygy?: unknown;
    promotionDialog: PromotionDialog;
    autoplay: boolean;
    isOnline: boolean;
    settings: Settings;
    pgnDialog: boolean;
    panelTab: string;
    socket: Socket;
    gameDatabase: GameDatabase;
}


export type GameDatabase = {
    response: IGameDatabase | null;
    isLoading: boolean;
}


export type User = {
    isLoggedIn: boolean;
    id: number;
    google_user_id: string;
    name: string;
    email: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: unknown;
    lastGameId: number;
}

export type OpeningMove = {
    fen: string;
    move: string;
    weight: number;
    san: string;
}

export type History = {
    id: number;
    f: string;
    m: string;
    s: string;
    vs: unknown[];
}

export type LastMove = {
    from: string;
    to: string;
}

export type Menu = {
    isOpen: boolean;
}

export type PromotionDialog = {
    isOpen: boolean;
}

export type Settings = {
    showEvaluation: boolean;
}

export type Socket = {
    isConnecting: boolean;
    isConnected: boolean;
}
