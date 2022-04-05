export default class WS {
    ws = undefined;
    url = "";
    protocols = undefined;
    handlers = {
        open: (e) => {console.log(`WS connection to ${this.url} opened`, e)},
        close: (e) => {console.log(`WS connection to ${this.url} closed`, e)},
        error: (e) => {console.log(`WS error in ${this.url}`, e)},
        // ...
        // more events that will come from server
    }

    constructor(url, protocols = undefined) {
        this.url = url;
        this.protocols = protocols;
    }

    open() {
        this.ws = new WebSocket(this.url, this.protocols);
        this.ws.onopen = (e) => {
            this.handlers.open(e);
        }
        this.ws.onerror = (e) => {
            this.handlers.error(e);
        }
        this.ws.onclose = (e) => {
            this.handlers.close(e);
        }
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("GET MESSAGE:", message, event);

            if (message?.e)
                this.handlers[message.e](message.d, event);
        }

        this.isOpened = true;
    }

    send(eventName, data) {
        if (!this.isOpened)
            throw Error('WS not opened');

        this.ws.send(JSON.stringify({e: eventName, d: data}));
    }

    close(status, reason) {
        this.ws.close(status, reason);
    }
}
