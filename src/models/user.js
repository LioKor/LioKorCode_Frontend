export class User {
  name = String
  login = String
  email = String
  avatarUrl = String
  chosenRoomId = Number

  set({name, login, email, avatarUrl}) {
    this.name = name || "";
    this.login = login || "";
    this.email = email || "";
    this.avatarUrl = avatarUrl || "https://i.yapx.ru/GuFDE.gif";
  }

  setChosenRoomId(id) {
    this.chosenRoomId = id;
  }
}
