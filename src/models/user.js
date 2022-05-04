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
    //avatarUrl: "https://i.yapx.ru/GuFDE.gif",
    jwtToken: '',
    chosenRoomId: -1,
  }

  toNetworkNames = {
    username: "username",
    email: "email",
    password: "password",
    fullname: "fullname",
  }

  set(data) {
    super.set(data);
    this.isLogined = true;
    this.avatarUrl = "https://i.yapx.ru/GuFDE.gif";
  }

  setChosenRoomId(id) {
    this.chosenRoomId = id;
  }
}
