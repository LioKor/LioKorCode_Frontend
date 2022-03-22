import Model from "./model";

export default class User extends Model {
  default = {
    id: '?',
    isLogined: false,
    username: "",
    login: "",
    password: "",
    email: "",
    fullname: "",
    avatarUrl: "https://i.yapx.ru/GuFDE.gif",
    chosenRoomId: -1,
  }

  toNetworkNames = {
    username,
    email,
    password,
    fullname,
  }

  set(data) {
    super.set(data);
    this.isLogined = true;
  }

  setChosenRoomId(id) {
    this.chosenRoomId = id;
  }
}
