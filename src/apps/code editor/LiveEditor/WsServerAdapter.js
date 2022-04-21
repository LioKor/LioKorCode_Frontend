export default class WsServerAdapter {
  ws = null;
  callbacks = {};
  openedFilename = null;

  otherFileOperationCallback = () => {};
  otherFileSelectionCallback = () => {};

  constructor(ws, openedFilename = null) {
    this.ws = ws;
    this.openedFilename = openedFilename;

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
        selection = data[2],
        filename = data[3];

      // if someone changed something in our file -> ot lib work with it
      if (this.openedFilename === filename) {
        this.callbacks.operation(operation);
        this.callbacks.selection(clientId, selection);
        return;
      }
      // else -> we need to indicate different file
      this.otherFileOperationCallback(filename);
    };

    this.ws.handlers.sel = (data) => {
      const
        clientId = data[0],
        selection = data[1],
        filename = data[2];

      // if someone selected something in our file -> ot lib work with it
      if (this.openedFilename === filename) {
        this.callbacks.selection(clientId, selection);
        return;
      }
      // else -> we need to indicate different file
      this.otherFileSelectionCallback(filename);
    };

    this.ws.handlers.reconnect = () => {
      this.callbacks.reconnect();
    };
  }

  // Functions below implements interface that defined in "ot" library
  sendOperation(revision, operation, selection) {
    this.ws.send('op', {
      data: [revision, operation, selection],
      filename: this.openedFilename
    });
  };

  sendSelection(selection) {
    this.ws.send('sel', {
      data: selection,
      filename: this.openedFilename
    });
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

  setOpenedFilename(filename) {
    this.openedFilename = filename;
  }
}
