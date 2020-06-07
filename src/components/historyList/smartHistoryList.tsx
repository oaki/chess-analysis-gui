import store from "../../store";
import * as React from "react";
import {memo, ReactElement, useEffect} from "react";
import {connect} from "react-redux";
import {batchActions} from "redux-batched-actions";
import {setEvaluation, setPosition, setUser} from "../../actions";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {lastMoveId, setHistory} from "../history/historyReducers";
import {setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {FIRST_ID} from "../moveTree/tree";
import {IHistoryGameResponse} from "./historyListReducers";
import {SwipeableList} from "@sandstreamdev/react-swipeable-list";
import "./style.scss";
import {Undef} from "../../interfaces";
import {ListItem} from "./listItem";
import {useFetch} from "../hooks/useFetch";
import {SessionManagerService} from "../../services/sessionManager";
import config from "../../config";
import {loadHistoryGames} from "../../layouts/historyPage";


interface HistoryListProps {
    historyList: IHistoryGameResponse[];
    history: any;
}

const HistoryList = memo((props: HistoryListProps) => {
    const [fetchState, doFetch] = useFetch();

    useEffect(() => {
        if (fetchState.response) {
            store.dispatch(loadHistoryGames());
        }
    }, [doFetch, fetchState.response]);


    const handleDeleteGame = (id: number) => doFetch(`${config.apiHost}/user/history/${id}`, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SessionManagerService.getToken()}`
        })
    });

    return (
        <SwipeableList>
            <Items handleDeleteGame={handleDeleteGame} historyList={props.historyList} history={props.history}/>
        </SwipeableList>
    )
});

interface ItemsProps {
    history: any;
    historyList: IHistoryGameResponse[];
    handleDeleteGame: (id: number) => void;
}

const Items = memo((props: ItemsProps) => {
    const handleLoadGame = (e: any) => {
        e.preventDefault();
        const id: number = Number(e.currentTarget.dataset.id);
        const historyGameResponse: Undef<IHistoryGameResponse> = props.historyList.find((item: IHistoryGameResponse) => {
            return Number(item.id) === id;
        });

        if (historyGameResponse) {
            const user = store.getState()["user"];
            store.dispatch(batchActions([
                setUser(user),
                setHistory(historyGameResponse.moves),
                lastMoveId(FIRST_ID),
                setPosition(""),
                setOpeningPosition([]),
                setEvaluation([]),
                setSyzygyEvaluation(null),
            ]));
        }
        props.history.push("/");
    };

    return (
        <>
            {props.historyList.map((historyGame: IHistoryGameResponse, index): ReactElement =>
                <ListItem
                    historyGame={historyGame}
                    handleLoadGame={handleLoadGame}
                    handleDeleteGame={props.handleDeleteGame}
                />)}
        </>
    )
});

const mapStateToProps = (state) => ({historyList: state.historyList});
export const SmartHistoryList = connect(mapStateToProps)(HistoryList);
