export default class WS {
    ws = undefined;
    url = "";
    protocols = undefined;
    handlers = {
        open: () => {console.log(`WS connection to ${this.url} opened`)},
        close: () => {console.log(`WS connection to ${this.url} closed`)},
        error: () => {console.log(`WS error in ${this.url}`)},
        // ...
        // more events that will come from server
    }

    constructor(url, protocols = undefined) {
        this.url = url;
        this.protocols = protocols;
    }

    open() {
        this.ws = new WebSocket(this.url, this.protocols);
        this.ws.onopen = () => {
            this.handlers.open();
        }
        this.ws.onerror = () => {
            this.handlers.error();
        }
        this.ws.onclose = () => {
            this.handlers.close();
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
