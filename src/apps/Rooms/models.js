import { stripTags } from '/src/utils/utils'

export class Message {
    constructor(username, content) {
        this.username = username;
        this.content = stripTags(content).replaceAll('\n', '<br />');
    }
}

export class Room {
    constructor(id, name, maxUsers, users) {
        this.id = id
        this.name = name;
        this.maxUsers = maxUsers;

        this.users = users
    }
}
