/** Class representing a "CountDown" */
class CountDown {
  onComplete;
  onRender;
  onWait;
  timeRemaining;

  /**
   * @class CountDown
   * @name CountDown
   *
   * @constructor
   * @param startDate {string}
   * @param endDate {string}
   * @param onRender {function}
   * @param onComplete {function}
   * @param onWait {function}
   * */
  constructor(startDate, endDate, onRender, onComplete, onWait) {
    this.onRender = onRender;
    this.onComplete = onComplete;
    this.onWait = onWait;

    this._setExpiredDate(startDate, endDate);
  }

  /**
   * @method destroy
   */
  destroy() {
    this.intervalId && clearInterval(this.intervalId);
  }

  /**
   * @method getTime
   * return {Object}
   */
  getTime() {
    return {
      days: Math.floor(this.timeRemaining / 1000 / 60 / 60 / 24),
      hours: Math.floor(this.timeRemaining / 1000 / 60 / 60) % 24,
      minutes: Math.floor(this.timeRemaining / 1000 / 60) % 60,
      seconds: Math.floor(this.timeRemaining / 1000) % 60,
    };
  }

  /**
   *
   * @method _setExpiredDate
   * @param startDate {string}
   * @param endDate {string}
   */
  // eslint-disable-next-line consistent-return
  _setExpiredDate(startDate, endDate) {
    const currentTime = new Date().getTime();
    const startTime = new Date(startDate).getTime();
    const finishTime = new Date(endDate).getTime();
    if (currentTime < startTime) return this._wait(startTime, finishTime);

    if (currentTime > finishTime) return this._complete();

    // calculate the remaining time
    this.timeRemaining = finishTime - currentTime;
    this.timeRemaining <= 0 ? this._complete() : this._start();
  }

  /**
   *
   * @method _complete
   */
  _complete() {
    if (typeof this.onComplete === 'function') {
      this.onComplete();
    }
  }

  /**
   *
   * @method _wait
   * @param startTime {number}
   * @param finishTime {number}
   */
  _wait(startTime, finishTime) {
    if (typeof this.onWait === 'function') {
      this.onWait(startTime, finishTime);
    }
  }

  /**
   *
   * @method _update
   */
  _update() {
    if (typeof this.onRender === 'function') {
      this.onRender(this.getTime());
    }
  }

  /**
   *
   * @method _start
   */
  _start() {
    // update the countdown
    this._update();

    //  setup a timer
    this.intervalId = setInterval(() => {
      // update the timer
      this.timeRemaining -= 1000;

      if (this.timeRemaining < 0) {
        // call the callback
        this._complete();

        // clear the interval if expired
        clearInterval(this.intervalId);
      } else {
        this._update();
      }
    }, 1000);
  }
}

export { CountDown };
