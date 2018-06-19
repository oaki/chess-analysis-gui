///<reference path="actions.tsx"/>
import * as React from "react";
import * as io from 'socket.io-client';
import config from "./config";
import {store} from "./store";
import {connect} from "react-redux";
import {setError, setEvaluation} from "./actions";
import {IWorkerResponse, LINE_MAP} from "./interfaces";
import {SocketManagerService} from "./services/socketManager";

// console.log('socketIoHost', config.socketIo.host);
// console.log('socketIoPath', config.socketIo.path);


export interface Evaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;
}

interface SocketIoProviderProps {
    evaluation: Evaluation
}


@connect((state) => ({fen: state.fen, evaluation: state.evaluation}))
export class SocketIoProvider extends React.Component<any, any> {


    render() {

        if (!this.props.evaluation || !this.props.evaluation[LINE_MAP.pv]) {
            return null
        }
        console.log('this.props.evaluation', this.props.evaluation);
        return (
            <div className="evaluation">
                {this.props.evaluation && <span className="score">{this.getScore()}</span>}
                {this.props.evaluation && <span className="depth">depth: {this.props.evaluation[LINE_MAP.depth]}</span>}
                {/*{this.props.evaluation && <span className="nodes">{this.getNodes()}</span>}*/}
                {this.props.evaluation && <span className="pv">{this.props.evaluation[LINE_MAP.pv]}</span>}
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fen !== this.props.fen) {
            console.log('setNewPosition');
            SocketManagerService.emit('setNewPosition', {
                FEN: this.props.fen
            });
        }
    }

    getScore() {
        const score = this.props.evaluation[LINE_MAP.score];
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