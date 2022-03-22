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
    name: "name",
    description: "description",
    stdinDescription: "stdinDescription",
    stdoutDescription: "stdoutDescription",
    hints: "hints",
    tests: "tests",
  }
}
