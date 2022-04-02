export default class ws {
    ws = undefined;
    onopen = () => {};
    onmessage = () => {};
    onerror = () => {};
    onclose = () => {};

    constructor(url, protocols) {
        this.url = url;
        this.protocols = protocols;
    }

    open() {
        this.ws = new WebSocket(this.url, this.protocols);
        this.ws.onopen = () => {
            console.log('WS on ' + this.url + ' opened.');
            this.onopen();
        }
        this.ws.onmessage = (event) => {
            const json = JSON.parse(event.data);
            this.onmessage(json);
        }
        this.ws.onerror = () => {
            console.log('Error in WS on ' + this.url + '.');
            this.onerror();
        }
        this.ws.onclose = () => {
            console.log('WS on ' + this.url + ' closed.');
            this.onclose();
        }
    }

    send(json) {
        this.ws.send(JSON.stringify(json));
    }
}
