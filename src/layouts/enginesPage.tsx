import * as React from "react";
import {connect} from "react-redux";
import store from "../store";
import {addWorker, deleteWorker, loadEngines} from "../actions";
import {IWorker} from "../reducers";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import * as faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import * as faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import {faMicrophoneSlash, faSignal} from "@fortawesome/fontawesome-free-solid";
import {MenuWithRouter} from "../components/menu/menu";
import {Header} from "../components/Header";


@connect((state) => ({
    workers: state.workers
}))
export class EnginesPageSmart extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            uuid: ""
        }
    }


    renderButton = (index, worker) => {
        return (
            <button className="btn btn-danger f-r" data-id={worker.id} onClick={this.handleDelete}>
                <FontAwesomeIcon icon={faTrash}/>
            </button>
        )
    }

    renderRows() {
        return this.props.workers.map((worker: IWorker, index: number) => (
            <li key={index} className="d-b p-t-md p-b-md list__bottom-line">
                {this.renderButton(index, worker)}
                <div className="f-l">
                    {worker.ready && <span className="c-green"><FontAwesomeIcon icon={faSignal}/></span>}
                    {!worker.ready && <span><FontAwesomeIcon icon={faMicrophoneSlash}/></span>}
                </div>
                <div className="p-l-xxl">
                    <div className="fs-5">{worker.name}</div>
                    <div className="fs-xs">{worker.uuid}</div>
                </div>
            </li>
        ));
    }

    handleSubmit = (e) => {

        store.dispatch(addWorker({
            name: this.state.name,
            uuid: this.state.uuid,
        }));

        this.setState({
            name: "",
            uuid: ""
        })
    }

    handleDelete = (e) => {

        store.dispatch(deleteWorker({
            id: e.currentTarget.dataset.id
        }));
    }

    handleNewName = (e) => {
        this.setState({name: e.currentTarget.value});
    }

    handleNewUuid = (e) => {
        this.setState({uuid: e.currentTarget.value});
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Header title="Your chess engines"/>

                        <table className="table fs-xs">
                            <thead>
                            <tr>
                                <th colSpan={2}>Name</th>
                                <th>Uuid</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colSpan={2}>
                                    <input onChange={this.handleNewName} type="text" value={this.state.name}/>
                                </td>
                                <td>
                                    <input onChange={this.handleNewUuid} type="text" value={this.state.uuid}/>
                                </td>
                                <td>
                                    <button className="btn btn-success" onClick={this.handleSubmit}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </button>
                                </td>
                            </tr>

                            </tbody>
                        </table>

                        <ul>
                            {this.renderRows()}
                        </ul>
                    </div>

                    <MenuWithRouter showMainMenu={true}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        store.dispatch(loadEngines());
    }
}


