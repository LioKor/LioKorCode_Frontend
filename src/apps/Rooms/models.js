import { stripTags } from '/src/utils/utils'

export class Message {
    constructor(username, content) {
        this.username = username;
        this.content = stripTags(content).replaceAll('\n', '<br />');
        this.date = new Date()
    }
}

export class User {
    constructor(id, username) {
        this.id = id
        this.username = username

        this.stream = null
        this.pc = null
        this.dc = null
    }
}

export class Room {
    constructor(id, name, maxUsers, host, users) {
        this.id = id
        this.name = name;
        this.maxUsers = maxUsers;
        this.host = host;

        this.users = users
    }

    addUser(user) {
        this.users.push(user)
    }

    deleteUser(id) {
        console.log(id)
        console.log(this.users)
        for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];

            if (user.id === id) {
                this.users.splice(i, 1)
                return
            }
        }
    }
}
