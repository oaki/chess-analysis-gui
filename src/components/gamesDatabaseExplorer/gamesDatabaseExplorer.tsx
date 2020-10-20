import React, {memo} from "react";
import {connect} from "react-redux";
import store from "../../store";
import {setMove} from "../history/historyReducers";
import {treeService} from "../moveTree/tree";
import {IState} from "../../interfaces";
import {SmallLoading} from "../Loading";
import "./gamesDatabaseExplorer.css";
import styled from "@emotion/styled";


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

const StyledGamesWrapper = styled.div`
  flex-grow: 1;
  overflow: auto;
  
  /* for Firefox */
  min-height: 0;
`
const GamesDatabaseExplorer = memo((props: any) => {
    return (

        <StyledGamesWrapper>
            <table className="games-database-explorer">
                <thead>
                <tr>
                    <th colSpan={2}>
                        <span className={"d-ib pr-sm"}>Games</span>
                        <SmallLoading isLoading={props.isLoading}/>
                    </th>
                </tr>
                </thead>
                <tbody>
                {props.response && renderRow(props)}

                {!props.isLoading && !props.response && <tr>
                  <td>No games in database.</td>
                </tr>}
                </tbody>
            </table>
        </StyledGamesWrapper>

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
