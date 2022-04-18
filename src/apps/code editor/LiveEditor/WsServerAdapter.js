export default class WsServerAdapter {
  ws = null;
  callbacks = {};

  constructor(ws) {
    this.ws = ws;

    this.quitOld = this.ws.handlers.quit;
    this.ws.handlers.quit = (clientId, name) => {
      this.quitOld(clientId);
      this.callbacks.client_left(clientId, name);
    };

    this.joinOld = this.ws.handlers.join;
    this.ws.handlers.join = (data) => {
      this.joinOld(data);
      this.callbacks.set_name(data.client_id, data.username);
    };

    this.ws.handlers.ok = () => {
      this.callbacks.ack();
    };

    this.ws.handlers.op = (data) => {
      const
        clientId = data[0],
        operation = data[1],
        selection = data[2];
      this.callbacks.operation(operation);
      this.callbacks.selection(clientId, selection);
    };

    this.ws.handlers.sel = (data) => {
      const
        clientId = data[0],
        selection = data[1];
      this.callbacks.selection(clientId, selection);
    };

    this.ws.handlers.reconnect = () => {
      this.callbacks.reconnect();
    };
  }

  // Next functions implements interface that defined in "ot" library
  sendOperation(revision, operation, selection) {
    this.ws.send('op', [revision, operation, selection]);
  };

  sendSelection(selection) {
    this.ws.send('sel', selection);
  };

  registerCallbacks(callbacks = {
    client_left: () => {},
    set_name: () => {},
    ack: () => {},
    operation: () => {},
    selection: () => {},
    clients: () => {},
    reconnect: () => {},
  }) {
    this.callbacks = callbacks;
  };
}
