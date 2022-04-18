export default class WS {
    ws = undefined;
    url = "";
    protocols = undefined;
    messageFields = [];
    handlers = {
        open: (e) => {console.log(`WS connection to ${this.url} opened`, e)},
        close: (e) => {console.log(`WS connection to ${this.url} closed`, e)},
        error: (e) => {console.log(`WS error in ${this.url}`, e)},
        // ...
        // more events that will come from server
    }

    constructor(url, messageFields = ['e', 'd'], protocols = undefined) {
        this.url = url;
        this.protocols = protocols;
        this.messageFields = messageFields;
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
            console.log("WS GET MESSAGE:", message);

            if (message?.e)
                this.handlers[message.e](message.d, event);
        }
    }

    send(message) {
        console.log("WS SEND MESSAGE:", message);
        const m = {};
        this.messageFields.forEach((field, idx) => {
            m[field] = message[idx];
        });
        this.ws.send(JSON.stringify(m));
    }

    close(status, reason) {
        this.ws.close(status, reason);
    }
}
