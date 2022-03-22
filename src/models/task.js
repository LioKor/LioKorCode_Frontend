import Model from "./model";

export default class Task extends Model {
  default = {
    id: '?',
    name: "",
    description: "",
    stdinDescription: "",
    stdoutDescription: "",
    hints: "",
    testsAmount: 0,
    tests: [],
    testsExamples: [],
  }

  toNetworkNames = {
    name,
    description,
    stdinDescription,
    stdoutDescription,
    hints,
    tests,
  }

  set(data) {
    super.set(data);
    this.isLogined = true;
  }

  setChosenRoomId(id) {
    this.chosenRoomId = id;
  }
}
