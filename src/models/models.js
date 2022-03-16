export class User {
  name = String
  login = String
  email = String
  chosenRoomId = Number

  set({name, login, email}) {
    this.name = name;
    this.login = login;
    this.email = email;
  }

  setChosenRoomId(id) {
    this.chosenRoomId = id;
  }
}
