import Opening from "./openingBook";
import * as React from 'react';

interface IPannelProps {
}

interface IEvaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;
}

interface IPannelState {
    evaluation?: IEvaluation;
    loading: boolean;
    pgn?: string;
    fen?: string;
}

export class Pannel extends React.Component<IPannelProps, IPannelState> {

    constructor(props: IPannelProps) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentDidMount() {

        this.handleLoadOpeningBook();
    }


    async loadOpeningBook() {
        this.setState({
            loading: true
        });

        const opening = new Opening();
        await opening.loadBook();

        return opening;
    }

    handleLoadOpeningBook = () => {
        this.setState({
            loading: true
        });

        this.loadOpeningBook().then((book) => {

            this.setState({
                loading: false
            })
        });

    }

    handleFenChange() {

    }

    render() {
        return (
            <div className="col-md-4">
                <div>
                    <input type="text" onChange={this.handleFenChange}/>
                </div>
                <div className="app__status">

                    {this.state.evaluation && <div className="score">{this.state.evaluation.score}</div>}
                    {this.state.evaluation && <div className="mate">{this.state.evaluation.mate}</div>}
                    {this.state.evaluation && <div className="nodes">{this.state.evaluation.nodes}</div>}
                    {this.state.evaluation && <div className="pv">{this.state.evaluation.pv}</div>}
                    <div className="app__opening">Caro can</div>
                    <div className="app__pgn">{this.state.pgn}</div>
                    <div className="app__fen">{this.state.fen}</div>
                    <div className="app__menu">
                        <ul>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                        </ul>
                    </div>
                </div>


            </div>
        )

    }
}