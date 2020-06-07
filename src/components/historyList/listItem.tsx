import {default as React, memo} from "react";
import {faArrowRight, faTrash} from "@fortawesome/fontawesome-free-solid";
import {formatDate} from "../../tools/formatDate";
import {SwipeableListItem} from "@sandstreamdev/react-swipeable-list";
import {IHistoryGameResponse} from "./historyListReducers";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {IHistoryMove} from "../history/historyReducers";
import {Move} from "./move";


export const ListItem = memo(({historyGame, handleLoadGame, handleDeleteGame}: ListItemProps) => {
    return (
        <SwipeableListItem
            key={historyGame.id}
            swipeRight={{
                content: <div className={"c-white pl-sm"}><FontAwesomeIcon icon={faTrash}/> Delete</div>,
                action: () => handleDeleteGame(historyGame.id)
            }}
        >
            <div key={historyGame.id}
                 onClick={handleLoadGame}
                 data-id={historyGame.id}>
                <div className="d-b p-sm cur-p">
                    <span className="c-white f-r"><FontAwesomeIcon icon={faArrowRight}/></span>

                    <div className="fs-xs">{formatDate(historyGame.updated_at)}</div>
                    <div className="ox-a fs-xs">
                        {historyGame.moves.map((move: IHistoryMove, index) => <Move move={move} index={index}/>)}
                    </div>
                </div>
            </div>

        </SwipeableListItem>
    )
});

interface ListItemProps {
    historyGame: IHistoryGameResponse;
    handleLoadGame: (e: any) => void;
    handleDeleteGame: (id: number) => void;
}
