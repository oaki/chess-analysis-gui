import * as React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {setMove} from "../history/historyReducers";
import {treeService} from "../moveTree/tree";
import {IGames, IGamesDatabaseProps, IGamesList} from "./gamesDatabaseReducers";
import {loadOpeningPosition} from "../openingExplorer/openingExplorerReducers";


export class GamesDatabaseExplorer extends React.Component<IGamesDatabaseProps, undefined> {

    componentDidUpdate(prevProps) {
        if (prevProps.fen !== this.props.fen) {
            store.dispatch(loadOpeningPosition(this.props.fen));
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        this.props.handleMove(e.currentTarget.dataset.move, e.currentTarget.dataset.fen);
    }

    render() {


        return (
            <div className="games-database-box">


                    <table className="games-database-explorer">
                        <thead>
                        <tr>
                            <th colSpan={3}>Games</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                2810 <br/>
                                2300
                            </td>
                            <td>
                                Karpov <br/>
                                Kasparov
                            </td>
                            <td>
                                1-0
                            </td>
                        </tr>
                        </tbody>
                    </table>


            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        moves: state.games || [],
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
