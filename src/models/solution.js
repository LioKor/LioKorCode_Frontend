import Model from "./model";

export default class Solution extends Model {
  default = {
    id: null,
    receivedDatetime: Date.now(),
    checkedDatetime: Date.now(),
    isOk: null,
    checkResult: -1,
    checkMessage: null,
    checkTime: null,
    compileTime: null,
    tests: [],
    testsPassed: null,
    testsTotal: null,

    status: 'checking',
    datetime: null
  }

  set(data) {
    super.set(data, this);
    this._setFormatTime();
    this._setStatus();
  }
  constructor() {
    super();
    this.setDefault();
    this._setFormatTime();
  }

  _setStatus() {
    let cls = 'error';
    const checkResults = {
      0: 'passed',
      1: 'checking',
      2: 'compile error',
      3: 'runtime error',
      4: 'check error',
      5: 'outdated (task changed)',
      6: 'runtime timeout',
      7: 'compile timeout',
      8: 'lint error',
      9: 'draft'
    }
    this.message = checkResults[this.checkResult];
    this.isOk = false;
    if (this.checkResult === 0) {
      cls = 'passed';
      this.isOk = true;
    } else if (this.testsPassed > 0) {
      cls = 'notFull';
    }
    this.status = cls;
  }

  _setFormatTime() {
    const dt = new Date(this.receivedDatetime);
    const curDate = dt.getDate();
    const now = new Date();
    const nowDate = now.getDate();

    dt.minute = dt.getMinutes().toString().padStart(2, '0');
    dt.hour = dt.getHours().toString().padStart(2, '0');
    dt.day = dt.getDate().toString().padStart(2, '0');
    dt.month = (dt.getMonth() + 1).toString().padStart(2, '0');
    dt.year = dt.getFullYear();

    if (curDate === nowDate) { // today
      this.datetime = `Сегодня в ${dt.hour}:${dt.minute}`;
    } else if (curDate === nowDate - 1) { // yesterday
      this.datetime = `Вчера в ${dt.hour}:${dt.minute}`;
    }
    // long time ago
    if (dt.getFullYear() === now.getFullYear()) // this year
      this.datetime = `${dt.day}.${dt.month} ${dt.hour}:${dt.minute}`;
    this.datetime = `${dt.day}.${dt.month}.${dt.year} ${dt.hour}:${dt.minute}`;
  }
}
