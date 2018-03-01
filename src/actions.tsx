export const UPDATE_LOADING = 'UPDATE_LOADING';
export const SET_POSITION = 'SET_POSITION';

export function setLoading(isLoading: boolean) {
    return {
        isLoading,
        type: UPDATE_LOADING
    };
}

export function setPosition(fen: string) {
    return {
        fen,
        type: SET_POSITION
    };
}

