import * as React from "react";
import {memo} from "react";
import {connect} from "react-redux";
import store from "../../store";
import {setMove} from "../history/historyReducers";
import {treeService} from "../moveTree/tree";
import {IState} from "../../interfaces";
import {SmallLoading} from "../Loading";
import "./gamesDatabaseExplorer.css";


function renderRow(props) {
    return props.response && props.response.games.map((game, index) => {
        return (
            <tr key={index}>

                <td>
                    <span style={{color: "white"}}>{game.white} ({game.whiteElo} )</span><br/>
                    <span style={{color: "#f1f1f1"}}>{game.black} ({game.blackElo})</span><br/>
                    <div className="games-database-explorer__line">{game.fewNextMove.join(" ")}</div>
                </td>
                <td className="games-database-explorer__results">
                    {game.result}
                </td>
            </tr>
        )
    })
}

const GamesDatabaseExplorer = memo((props: any) => {
    return (
        <div className="games-database-box">

            <SmallLoading isLoading={props.isLoading}/>

            {props.response &&
            <table className="games-database-explorer">
              <thead>
              <tr>
                <th colSpan={2}>Games</th>
              </tr>
              </thead>
              <tbody>
              {renderRow(props)}
              </tbody>
            </table>
            }

            {!props.isLoading && !props.response && <div>
              No games in database.
            </div>}
        </div>
    )
});

function mapStateToProps(state: IState) {
    return {
        response: state.gameDatabase.response,
        isLoading: state.gameDatabase.isLoading,
        fen: state.fen,
    }
}

function mapDispatchToProps(dispatch: (data: any) => {}) {
    return {
        handleMove(move: string) {
            const fen = store.getState()["fen"];

            dispatch(setMove({
                from: move.substring(0, 2),
                to: move.substring(2, 4),
                id: treeService.getCounter(),
                fen
            }));
        }
    };
}

export const SmartGamesDatabaseExplorer = connect(mapStateToProps, mapDispatchToProps)(GamesDatabaseExplorer);
