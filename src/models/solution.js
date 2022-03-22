import Model from "./model";

export default class Solution extends Model {
  default = {
    id: '?',
    datetime: Date.now(),
    checkResult: -1,
    status: 'checking',
    testsPassed: '?',
    testsTotal: '?',
  }

  set(data) {
    super.set(data);
    this._setFormatTime();
    this._setStatus();
  }

  _setStatus() {
    let cls = 'error';
    if (this.checkResult === 0) {
      cls = 'passed';
    } else if (this.checkResult === 1) {
      cls = 'checking';
    } else if (this.testsPassed > 0) {
      cls = 'notFull';
    }
    this.status = cls;
  }

  _setFormatTime() {
    const dt = new Date(this.datetime);
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
