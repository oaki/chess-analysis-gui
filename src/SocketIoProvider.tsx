import * as React from "react";
// import * as io from 'socket.io-client';
// import config from "./config";

// console.log('socketIoHost', config.socketIo.host);
// console.log('socketIoPath', config.socketIo.path);
// const socket = io(config.socketIo.host, {path: config.socketIo.path});

export class SocketIoProvider extends React.Component {
    render() {

        return (
            <div>
                {this.props.children}
            </div>
        );
    }

    componentDidMount() {
        // socket.on('on_result', (result) => {
        //     console.log('browser: on_result', result);
        //     // this.handleWorkerResult(result.data);
        // });
    }
}