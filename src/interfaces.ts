import {IGameDatabase} from "./components/gamesDatabaseExplorer/gamesDatabaseReducers";

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

export interface IWorkerResponse extends IEvaluation {
    fen: string;
}

export interface IEvaluation {
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

export type IAction<TPayload> = {
    type: string;
    payload: TPayload;
}

export interface IState {
    loading: boolean;
    user: User;
    fen: string;
    evaluation: any[];
    openingMoves: OpeningMove[];
    errors: any[];
    history: History[];
    status: string;
    isFlip: boolean;
    lastMoveId: number;
    lastMove: LastMove;
    menu: Menu;
    workers: any[];
    onMove: number;
    historyList: any[];
    syzygy?: any;
    promotionDialog: PromotionDialog;
    autoplay: boolean;
    isOnline: boolean;
    settings: Settings;
    pgnDialog: boolean;
    panelTab: string;
    socket: Socket;
    gameDatabase: GameDatabase;
}


export interface GameDatabase {
    response: IGameDatabase | null;
    isLoading: boolean;
}


export interface User {
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
    deleted_at?: any;
    lastGameId: number;
}

export interface OpeningMove {
    fen: string;
    move: string;
    weight: number;
    san: string;
}

export interface History {
    id: number;
    f: string;
    m: string;
    s: string;
    vs: any[];
}

export interface LastMove {
    from: string;
    to: string;
}

export interface Menu {
    isOpen: boolean;
}

export interface PromotionDialog {
    isOpen: boolean;
}

export interface Settings {
    showEvaluation: boolean;
}

export interface Socket {
    isConnecting: boolean;
    isConnected: boolean;
}




