import React, {memo, type ComponentType} from "react";
import {connect} from "../../libs/stateCompat";
import { store } from "../../store";
import {setMove} from "../history/historyReducers";
import {treeService} from "../moveTree/tree";
import { ReduxStateShape } from "../../reducers";
import type { GameDatabase } from "../../interfaces";
import {SmallLoading} from "../Loading";
import "./gamesDatabaseExplorer.css";
import styled from "@emotion/styled";


function renderRow(props: Pick<GameDatabase, "response">) {
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
type GamesDatabaseExplorerProps = Pick<GameDatabase, "response" | "isLoading"> & { fen: string };

const GamesDatabaseExplorer = memo((props: GamesDatabaseExplorerProps) => {
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

function mapStateToProps(state: ReduxStateShape) {
    const gameDatabase = state.gameDatabase as GameDatabase;
    return {
        response: gameDatabase.response,
        isLoading: gameDatabase.isLoading,
        fen: state.fen,
    }
}

function mapDispatchToProps(dispatch: (action: unknown) => unknown) {
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

export const SmartGamesDatabaseExplorer = connect(mapStateToProps, mapDispatchToProps)(
  GamesDatabaseExplorer
) as unknown as ComponentType<Record<string, never>>;
