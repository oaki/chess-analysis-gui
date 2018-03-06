import Opening from "../openingBook";

const sendMessage: any = self.postMessage;

const opening = new Opening();

self.onmessage = async function (this: Window, event: MessageEvent) {
    const action = event.data.action;
    console.log('onmessage', action);

    if (!opening.isbookLoaded()) {

        await opening.loadBook();
        console.log('bookLoaded');
    }

    switch (action) {
        case 'find':
            const moves = await opening;
            sendMessage({'moves': moves});
            break;
    }

    sendMessage({'jaa': 222});

};
