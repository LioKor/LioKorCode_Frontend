const CONNECT_TIMEOUT = 2000

const BASE_RECONNECT_TIMEOUT = 1000
const MAX_RECONNECT_TIMEOUT = 60 * 1000


export default class ReconnectingWebSocket {
    constructor(url, handlers) {
        this.url = url
        this.handlers = handlers

        this.reconnectTimeout = BASE_RECONNECT_TIMEOUT

        this.createWsConnection()
    }

    createWsConnection() {
        this.ws = new WebSocket(this.url);
        setTimeout(function() {
            if (this.ws.readyState === 0) {
                this.ws.close()
            }
        }.bind(this), CONNECT_TIMEOUT)

        this.ws.addEventListener('close', function() {
            this.handlers.close()

            setTimeout(function() {
                if (this.ws.readyState === 1) {
                    return
                }
                this.createWsConnection()
                if (this.reconnectTimeout < MAX_RECONNECT_TIMEOUT) {
                    this.reconnectTimeout *= 2
                }
            }.bind(this), this.reconnectTimeout)
        }.bind(this))

        this.ws.addEventListener('open', () => {
            this.reconnectTimeout = BASE_RECONNECT_TIMEOUT
            this.handlers.open()
        })

        this.ws.addEventListener('message', (message) => {
            this.handlers.message(message)
        })
    }

    sendJSON(data) {
        this.ws.send(JSON.stringify(data))
    }
}
