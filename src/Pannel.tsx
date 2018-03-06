import Opening from "./openingBook";
import * as React from 'react';
import {connect} from 'react-redux';
import {SmartOpeningExplorer} from "./OpeningExplorer";
import {store} from "./store";
import {loadOpeningBook} from "./actions";

interface IPannelProps {
    status: string;
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

const mapStateToProps = (state) => ({status: state.status});


@connect(mapStateToProps)
export class Pannel extends React.Component<any, IPannelState> {

    constructor(props: IPannelProps) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentDidMount() {

        console.log('onmessage LOAD AFTER componentDidMount');
        store.dispatch(loadOpeningBook());
        // this.handleLoadOpeningBook();
    }


    async loadOpeningBook() {

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
            <div className="col-md-12">

                <div className="app__status">

                    {this.state.evaluation && <div className="score">{this.state.evaluation.score}</div>}
                    {this.state.evaluation && <div className="mate">{this.state.evaluation.mate}</div>}
                    {this.state.evaluation && <div className="nodes">{this.state.evaluation.nodes}</div>}
                    {this.state.evaluation && <div className="pv">{this.state.evaluation.pv}</div>}
                    <div className="app__opening">{this.props.status}</div>
                    <div className="app__pgn">{this.state.pgn}</div>
                    <div className="app__fen">{this.state.fen}</div>

                </div>

                <SmartOpeningExplorer/>

            </div>
        )

    }
}
