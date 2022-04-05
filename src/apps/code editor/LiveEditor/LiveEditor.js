import WS from "../../../utils/ws.js";
import WsServerAdapter from "./WsServerAdapter.js";

export default class LiveEditor {
  ws = null;
  editor = null;
  client = null;

  constructor(editor, roomId) {
    // Get and setup ace editor
    this.editor = editor;
    editor.setOptions({
      fontSize: '12pt',
      tabSize: 4,
      useSoftTabs: true,

      readOnly: true,
    });

    // Create WebSocket connection
    //this.ws = new WS([location.protocol.replace('http', 'ws'), '//', location.host, '/redactor/', roomId].join(''));
    this.ws = new WS('ws://127.0.0.1:8080/ws');

    this.__setupHandlers();

    this.ws.open();
  }

  // Base events scenery:
  // 1. open
  // 2. doc (get text)
  // 3. -> join
  // 4. <- registered
  // 5. join/quit, working editorClient
  // 6. close

  __setupHandlers() {
    // Setup handlers on WebSocket connection:
    // Connect to server
    this.ws.handlers.open = () => {
      console.log('WS live redactor connected to server');
    };

    // Disconnect form server
    this.ws.handlers.close = () => {
      console.log('WS live redactor disconnected from server');
    };

    // Get initial text that other users typed.
    // Set EditorAdapter that will do main logic - merge changes form other users
    this.ws.handlers.doc = (data) => {
      this.editor.setValue(data.document, 1);
      const
        serverAdapter = new WsServerAdapter(this.ws),
        editorAdapter = new ot.AceEditorAdapter(this.editor);
      this.client = new ot.EditorClient(data.revision, data.clients, serverAdapter, editorAdapter);
    };

    // Our client registered => we can type text
    this.ws.handlers.registered = () => {
      this.editor.setOption('readOnly', false);
    };

    // New user joined
    this.ws.handlers.join = (data) => {
      console.log("User joined: ", data);
    };

    // Some user quit
    this.ws.handlers.quit = (clientId) => {
      console.log("User quit with id: ", clientId);
    };
  }

  // Send our 'join' event on server
  join(username) {
    this.username = username;
    this.ws.send('join', { username });
  }
  // Send our 'leave' event on server
  leave() {
    this.ws.send('leave', { username: this.username });
    this.ws.close();
  }
}
