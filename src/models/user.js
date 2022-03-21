export default class User {
  isLogined = Boolean
  username = String
  login = String
  email = String
  fullname = String
  avatarUrl = String
  chosenRoomId = Number

  setDefault() {
    this.set({});
    this.isLogined = false;
    this.chosenRoomId = -1;
  }

  constructor() {
    this.setDefault();
  }

  set({username = "", login = "", email = "", fullname = "", avatarUrl = "https://i.yapx.ru/GuFDE.gif"}) {
    this.isLogined = true;
    this.username = username;
    this.login = login;
    this.email = email;
    this.fullname = fullname;
    this.avatarUrl = avatarUrl;
  }

  setChosenRoomId(id) {
    this.chosenRoomId = id;
  }
}
