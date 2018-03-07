import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {deepCopy} from "./reducers";

interface IHistoryProps {
    history: string[];
}

@connect((state) => ({history: state.history}))
export class History extends React.Component<any, any> {


    private getMoveNumber() {
        return Math.round((this.props.history.length + 1) / 2);
    }

    renderMoveNum(index) {
        if (index % 2 === 1) {
            return null
        }
        const counter = Math.round((index + 1) / 2);
        const className = ` move_num move_num_${counter}`;
        return <span key={`move_${index}`} className={className} id={className}>{counter}. </span>
    }

    renderMoves() {

        return this.props.history.map((move, index) => {
            return [
                this.renderMoveNum(index),
                (<span className="move" key={index}>{move}</span>)
            ]
        })
    }

    render() {

        const count = this.props.history.length;
        const sliderWidth = count * 35 + Math.round(count / 2) * 20;
        const style = {
            width: `${sliderWidth}px`
        };
        return (
            <div className="history">
                <div className="history__title">
                    History
                </div>
                <div className="history__slider">
                    <div className="history__slider__holder" style={style}>
                        {this.renderMoves()}
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        const num = this.getMoveNumber();
        // const node = ReactDOM.findDOMNode(this).getElementsByClassName('history__slider__holder')[0];
        const els: NodeListOf<Element> = ReactDOM.findDOMNode(this).getElementsByClassName(`move`);

        if (els.length) {
            els[els.length - 1].scrollIntoView();
        }
        // node.scrollLeft = elem.scrollHeight;

        // console.log('node.scrollLeft',node.scrollLeft);
    };
}
