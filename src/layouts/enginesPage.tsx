import * as React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, Switch} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {addWorker, deleteWorker, loadEngines, setUser} from "../actions";
import {store} from "../store";
import {IWorker} from "../reducers";
import {SmartError} from "../components/error";

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
                    <td>{worker.name}</td>
                    <td>{worker.uuid}</td>
                    <td>
                        <button className="btn btn-danger" data-id={worker.id} onClick={this.handleDelete}>Remove
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
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Uuid</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <input className="form-control" onChange={this.handleNewName} type="text" value={this.state.name}/>
                                </td>
                                <td>
                                    <input className="form-control" onChange={this.handleNewUuid} type="text" value={this.state.uuid}/>
                                </td>
                                <td>
                                    <button className="btn btn-success" onClick={this.handleSubmit}>Add</button>
                                </td>
                            </tr>
                            {this.renderRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        store.dispatch(loadEngines());
    }
}
