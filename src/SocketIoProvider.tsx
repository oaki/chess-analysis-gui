import * as React from "react";

import {connect} from "react-redux";

import {IEvaluation, LINE_MAP} from "./interfaces";
import {SocketManagerService} from "./services/socketManager";

export interface Evaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;
}

interface SocketIoProviderProps {
    evaluation: Evaluation[]
}


@connect((state) => ({fen: state.fen, evaluation: state.evaluation}))
export class SocketIoProvider extends React.Component<any, any> {


    renderLine(evaluation:IEvaluation) {
        return (
            <div className="evaluation" key={evaluation[LINE_MAP.pv]}>
                {evaluation && <span className="score">{this.getScore(evaluation)}</span>}
                {evaluation && <span className="depth">depth: {evaluation[LINE_MAP.depth]}</span>}
                {/*{this.props.evaluation && <span className="nodes">{this.getNodes()}</span>}*/}
                {evaluation && <span className="pv">{evaluation[LINE_MAP.pv]}</span>}
            </div>
        )
    }

    render() {

        if (this.props.evaluation.length === 0) {
            return null
        }
        console.log('this.props.evaluation', this.props.evaluation);
        return this.props.evaluation.map((evaluation) => this.renderLine(evaluation));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fen !== this.props.fen) {
            console.log('setNewPosition');
            SocketManagerService.emit('setNewPosition', {
                FEN: this.props.fen
            });
        }
    }

    getScore(evaluation:IEvaluation) {
        const score = evaluation[LINE_MAP.score];
        if (Number(score) >= 0) {
            return `+${score}`;
        }

        return score;
    }

    getNodes() {
        const nodes = this.props.evaluation[LINE_MAP.nodes];
        const d = nodes / 1000;
        return `${d}K`;
    }

}