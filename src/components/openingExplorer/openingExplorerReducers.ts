import {setLoading} from "../../actions";
import config from "../../config";
import {Flash} from "../../services/errorManager";


export interface IOpeningMove {
    move: string;
    weight: number;
    fen: string;
    san: string;
}



export function loadOpeningPosition(fen: string):any {
    return async (dispatch: (data: any) => {}) => {
        console.log("loadOpeningPosition", fen);

        dispatch(setLoading(true));

        const url = `${config.apiHost}/opening-book?fen=${fen}`;
        const headers: RequestInit = {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json"
            })
        };

        try {
            const response = await fetch(url, headers);
            if (response.ok) {
                const moves: any = await response.json();
                console.log(moves);
                dispatch(setOpeningPosition(moves));
            } else {
                dispatch(setOpeningPosition([]));
            }

        } catch (e) {
            Flash.error({msg: "opening book failed", identifier: "openingExplorer"});
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function setOpeningPosition(moves: IOpeningMove[]) {
    return {
        moves,
        type: SET_OPENING_POSITION
    };
}

export const SET_OPENING_POSITION = "SET_OPENING_POSITION";

export function openingMovesReducer(moves: IOpeningMove[] = [], action: any) {

    switch (action.type) {
        case SET_OPENING_POSITION:
            return action.moves;

        default:
            return moves;
    }
};
