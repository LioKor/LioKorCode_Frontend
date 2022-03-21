export class User {
  isLogined = Boolean
  username = String
  login = String
  email = String
  fullname = String
  avatarUrl = String
  chosenRoomId = Number

  setDefault() {
    this.isLogined = false;
    this.username = "";
    this.login = "";
    this.email = "";
    this.fullname = "";
    this.avatarUrl = "https://i.yapx.ru/GuFDE.gif";
    this.chosenRoomId = -1;
  }

  constructor() {
    this.setDefault();
  }

  set({username, login, email, fullname, avatarUrl}) {
    this.isLogined = true;
    this.username = username || "";
    this.login = login || "";
    this.email = email || "";
    this.fullname = fullname || "";
    this.avatarUrl = avatarUrl || "https://i.yapx.ru/GuFDE.gif";
  }

  setChosenRoomId(id) {
    this.chosenRoomId = id;
  }
}
