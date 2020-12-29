import {getOpening} from "../openingBook";

const sendMessage: any = self.postMessage;


// @ts-ignore
self.onmessage = async function (this: Window, event: MessageEvent) {
    const action = event.data.action;
    console.log("onmessage", action);

    switch (action) {
        case "find":
            // const moves = await getOpening();
            // sendMessage({"moves": moves});
            break;
    }

};
