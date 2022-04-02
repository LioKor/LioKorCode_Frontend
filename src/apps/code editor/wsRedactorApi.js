import ws from "../../utils/ws.js";

export default class wsRedactorApi extends ws {
    constructor(apiUrl, sessionId = '') {
        super('ws://' + apiUrl + '/redactor' + (sessionId ? '/' + sessionId : ''));
    }

    set(path, pos) {
        this.send({type: 'set', pos: pos, path: path})
    };
    select(path, pos1, pos2) {
        this.send({type: 'select', pos: pos1, pos2: pos2, path: path})
    };
    add(path, pos, text) {
        this.send({type: 'add', pos: pos, text: text, path: path});
    };
    delete(path, pos1, pos2) {
        this.send({type: 'delete', pos: pos1, pos2: pos2, path: path});
    }
}
