import { stripTags } from '/src/utils/utils'

export class Message {
    constructor(username, content) {
        this.username = username;
        this.content = stripTags(content).replaceAll('\n', '<br />');
        this.date = new Date()
    }
}

export class User {
    constructor(id, username, fullname = null) {
        this.id = id
        this.username = username
        this.fullname = fullname

        this.stream = null
        this.pc = null
        this.dc = null
    }
}

export class Room {
    constructor(id, name, owner, maxUsers, hasPassword, host, users) {
        this.id = id
        this.name = name
        this.owner = owner
        this.maxUsers = maxUsers
        this.hasPassword = hasPassword
        this.host = host

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
