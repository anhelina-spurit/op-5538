/**
 *
 * Version: 1.0.0
 * Author: SpurIT
 * Website: https://spur-i-t.com/
 */

function Listeners() {
  this.entries = [];
}

/**
 *
 * @param element {HTMLElement|Element|Node|Object}
 * @param event {string}
 * @param fn {function}
 * @param [options] {Object}
 */
Listeners.prototype.add = function (element, event, fn, options) {
  if (!element) return;
  element.addEventListener(event, fn, options);
  this.entries.push({ element, event, fn });
};

/**
 *
 */
Listeners.prototype.removeAll = function () {
  this.entries = this.entries.filter(function (listener) {
    listener.element.removeEventListener(listener.event, listener.fn);
    return false;
  });
};

/**
 *
 * @param element {HTMLElement|Element|Node|Object}
 * @param event {string}
 * @param fn {function}
 */
Listeners.prototype.remove = function (element, event, fn) {
  const argumentsLength = arguments.length;
  this.entries = this.entries.filter(function (listener) {
    if (argumentsLength === 3 && listener.element === element && listener.event === event && listener.fn === fn) {
      element.removeEventListener(event, fn);
      return false;
    } else if (argumentsLength === 2 && listener.element === element && listener.event === event) {
      element.removeEventListener(event, listener.fn);
      return false;
    } else if (argumentsLength === 1 && listener.element === element) {
      element.removeEventListener(listener.event, listener.fn);
      return false;
    }
    return true;
  });
};

export { Listeners };
