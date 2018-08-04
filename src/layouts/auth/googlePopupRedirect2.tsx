// import * as React from "react";
// import GoogleLogin from "react-google-login";
// import config from "../../config/index";
// import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
// import {setUser} from "../../actions";
// import {connect} from "react-redux";
// import {IUser} from "../../reducers";
// import {SessionManagerService} from "../../services/sessionManager";
// import {store} from "../../store";
// import {ApiManagerService} from "../../services/apiManager";
// import {setHistory} from "../../components/history/History";
//
//
// export default class GooglePopupRedirect2 extends React.Component<any, any> {
//     state = {
//         redirectToReferrer: false
//     };
//
//
//     handleOnSuccess = async (res) => {
//         debugger;
//         const values: IUser = {
//             isLoggedIn: true,
//             email: res.profileObj.email,
//             name: res.profileObj.name,
//             img: res.profileObj.imageUrl,
//             googleToken: res.tokenId,
//             token: "",
//             last_game_id: 0,
//         };
//
//         const apiRes = await ApiManagerService.getSignUser(values);
//         console.log("jwtToken", apiRes);
//         values.token = apiRes.token;
//
//
//         const game = await ApiManagerService.getLastGame(apiRes.token);
//
//         console.log("game", game);
//         values.last_game_id = game.id;
//
//
//         // set history
//         // setHistoryMove();
//         // console.log('responseGoogle', res);
//
//         SessionManagerService.setUser(values);
//         store.dispatch(setUser(values));
//         store.dispatch(setHistory(game.moves));
//     }
//
//     handleOnFailure = (res) => {
//         SessionManagerService.removeUser();
//
//         setUser(SessionManagerService.getUser());
//
//         console.log("res", res);
//     }
//
//
//     render() {
//         let autoload = true;
//         if (location.hash.indexOf("#id_token=") === 0) {
//             autoload = false;
//         }
//         return (
//             <GoogleLogin
//                 clientId={config.google.clientId}
//                 buttonText="Google"
//                 onSuccess={this.handleOnSuccess}
//                 onFailure={this.handleOnFailure}
//                 uxMode={"redirect"}
//                 autoLoad={autoload}
//             />
//         );
//     }
// }