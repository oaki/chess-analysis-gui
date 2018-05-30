import Opening from "./openingBook";
import * as React from 'react';
import {connect} from 'react-redux';
import {SmartOpeningExplorer} from "./OpeningExplorer";
import {store} from "./store";
import {loadOpeningBook} from "./actions";
import {SocketIoProvider} from "./SocketIoProvider";
import {History} from "./components/History";

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

@connect((state) => ({status: state.status}))
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
    }

    /*

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

        }*/

    render() {
        return (
            <div>

                <SmartOpeningExplorer/>



                <div className="app__status">

                    <SocketIoProvider/>

                    <div className="app__pgn">{this.state.pgn}</div>
                    <div className="app__fen">{this.state.fen}</div>
                    <div className="app__opening">{this.props.status}</div>

                </div>




            </div>
        )

    }
}
