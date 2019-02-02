import * as React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {setMove} from "../history/historyReducers";
import {treeService} from "../moveTree/tree";
import {IGamesDatabaseProps} from "./gamesDatabaseReducers";


export class GamesDatabaseExplorer extends React.Component<IGamesDatabaseProps, undefined> {


    handleClick = (e) => {
        e.preventDefault();
        this.props.handleMove(e.currentTarget.dataset.move, e.currentTarget.dataset.fen);
    }

    renderGameLine(pgn: string, fen: string) {
        console.log();
    }

    renderRow() {
        return this.props.gameDatabase && this.props.gameDatabase.games.map((game, index) => {
            return (
                <tr key={index}>

                    <td>
                        <span style={{color: "white"}}>{game.white} ({game.whiteElo} )</span><br/>
                        <span style={{color: "#f1f1f1"}}>{game.black} ({game.blackElo})</span><br/>
                        <div className="fs-xs">{game.fewNextMove.join(" ")}</div>
                    </td>
                    <td className="games-database-explorer__results">
                        {game.result}
                    </td>
                </tr>
            )
        })
    }


    render() {


        return (
            <div className="games-database-box">

                {this.props.gameDatabase &&
                <table className="games-database-explorer">
                  <thead>
                  <tr>
                    <th colSpan={2}>Games</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.renderRow()}
                  </tbody>
                </table>
                }

                {!this.props.gameDatabase && <div>
                  No games in database.
                </div>}
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        gameDatabase: state.gameDatabase,
        fen: state.fen
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
