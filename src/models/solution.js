import Model from "./model";

export default class Solution extends Model {
  default = {
    id: '?',
    receivedDatetime: Date.now(),
    datetime: "",
    checkResult: -1,
    status: 'checking',
    testsPassed: '?',
    testsTotal: '?',
    message: '?',
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
    switch (this.checkResult) {
    case 0:
      cls = 'passed';
      this.message = 'passed';
      break;
    case 1:
      this.message = 'compile error';
      break;
    case 2:
      this.message = 'runtime error';
      break;
    case 3:
      this.message = 'check error';
      break;
    case 4:
      this.message = 'timeout';
      break;
    case 5:
      this.message = 'outdated (task changed)';
      break;
    }
    if (cls === 'error' && this.testsPassed > 0)
      cls = 'notFull';
    this.status = cls;
  }

  _setFormatTime() {
    const dt = new Date(this.receivedDatetime);
    const curDate = dt.getDate();
    const now = new Date();
    const nowDate = now.getDate();

    dt.minute = dt.getMinutes().toString().padStart(2, '0');
    dt.hour = dt.getHours().toString().padStart(2, '0');
    dt.day = dt.getDay().toString().padStart(2, '0');
    dt.month = dt.getMonth().toString().padStart(2, '0');
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
