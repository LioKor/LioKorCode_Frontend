export default class Solution {
  id = Number
  datetime = String
  checkResult = Number
  status = String
  testsPassed = Number
  testsTotal = Number

  setDefault() {
    this.set({});
  }

  constructor() {
    this.setDefault();
  }

  set({id = '?', receivedDatetime = Date.now(), checkResult = -1, testsPassed = '?', testsTotal = '?'}) {
    this.id = id;
    this.datetime = this.formatTime(receivedDatetime);
    this.checkResult = checkResult;
    this.testsPassed = testsPassed;
    this.testsTotal = testsPassed;
    this.status = this._getStatus();
  }

  _getStatus() {
    let cls = 'error';
    if (this.checkResult === 0) {
      cls = 'passed';
    } else if (this.checkResult === 1) {
      cls = 'checking';
    } else if (this.testsPassed > 0) {
      cls = 'notFull';
    }
    return cls;
  }

  formatTime(date) {
    const dt = new Date(date);
    const curDate = dt.getDate();
    const now = new Date();
    const nowDate = now.getDate();

    dt.minute = dt.getMinutes().toString().padStart(2, '0');
    dt.hour = dt.getHours().toString().padStart(2, '0');
    dt.day = dt.getDay().toString().padStart(2, '0');
    dt.month = dt.getMonth().toString().padStart(2, '0');
    dt.year = dt.getFullYear();

    if (curDate === nowDate) { // today
      return `Сегодня в ${dt.hour}:${dt.minute}`;
    } else if (curDate === nowDate - 1) { // yesterday
      return `Вчера в ${dt.hour}:${dt.minute}`;
    }
    // long time ago
    if (dt.getFullYear() === now.getFullYear()) // this year
      return `${dt.day}.${dt.month} ${dt.hour}:${dt.minute}`;
    return `${dt.day}.${dt.month}.${dt.year} ${dt.hour}:${dt.minute}`;
  }
}
