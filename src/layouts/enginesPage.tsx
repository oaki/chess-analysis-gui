import * as React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, Switch} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {addWorker, deleteWorker, loadEngines, setUser} from "../actions";
import {store} from "../store";
import {IWorker} from "../reducers";
import {SmartError} from "../components/error";

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import * as faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import {faMicrophoneSlash, faSignal} from "@fortawesome/fontawesome-free-solid";
import {Menu} from "../components/Menu";


@connect((state) => ({
    workers: state.workers
}))
export class EnginesPageSmart extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            uuid: ''
        }
    }

    renderRows() {
        return this.props.workers.map((worker: IWorker, index: number) => {
            return (
                <tr key={index}>
                    <td>
                        {worker.ready && <span className="c-green"><FontAwesomeIcon icon={faSignal}/></span>}
                        {!worker.ready && <span><FontAwesomeIcon icon={faMicrophoneSlash}/></span>}
                    </td>
                    <td>{worker.name}</td>
                    <td>{worker.uuid}</td>
                    <td>
                        <button className="btn btn-danger" data-id={worker.id} onClick={this.handleDelete}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </td>
                </tr>
            );
        })
    }

    handleSubmit = (e) => {

        store.dispatch(addWorker({
            name: this.state.name,
            uuid: this.state.uuid,
        }));

        this.setState({
            name: '',
            uuid: ''
        })
    }

    handleDelete = (e) => {

        store.dispatch(deleteWorker({
            id: e.target.dataset.id
        }));
    }

    handleNewName = (e) => {
        this.setState({name: e.target.value});
    }

    handleNewUuid = (e) => {
        this.setState({uuid: e.target.value});
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <SmartError/>
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
                                    <input className="form-control" onChange={this.handleNewName} type="text" value={this.state.name}/>
                                </td>
                                <td>
                                    <input className="form-control" onChange={this.handleNewUuid} type="text" value={this.state.uuid}/>
                                </td>
                                <td>
                                    <button className="btn btn-success" onClick={this.handleSubmit}><FontAwesomeIcon icon={faPlus}/></button>
                                </td>
                            </tr>
                            {this.renderRows()}
                            </tbody>
                        </table>
                    </div>

                    <Menu showMainMenu={true}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        store.dispatch(loadEngines());
    }
}
