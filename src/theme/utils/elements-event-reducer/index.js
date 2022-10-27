import { Listeners } from '../listeners';

/** Class representing a "ElementsEventReducer" */
class ElementsEventReducer {
  /**
   * @class ElementsEventReducer
   * @name ElementsEventReducer
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * @param options {Object}
   * */
  constructor(container = document, options) {
    this._listeners = new Listeners();
    this._container = container;
    this._options = options;
    this._setListeners();
  }

  /**
   * @method destroy
   */
  destroy() {
    this._listeners.removeAll();
  }

  /**
   * @method _isMatchesClosestSelector
   * @param target {HTMLElement|Element|Node|Object}
   * @param selector {string}
   * @return boolean
   */
  _isMatchesClosestSelector(target, selector) {
    return target.closest(selector)?.matches(selector);
  }

  /**
   * @method _reducer
   * @param event {Event}
   */
  _reducer(event) {
    const { target, type } = event;
    const selectors = Object.keys(this._options[type]);
    selectors.map(
      (selector) => this._isMatchesClosestSelector(target, selector) && this._options[type][selector](event),
    );
  }

  /**
   * @method _setListeners
   */
  _setListeners() {
    const eventNames = Object.keys(this._options);
    eventNames.forEach((eventName) => this._listeners.add(this._container, eventName, this._reducer.bind(this)));
  }
}

export { ElementsEventReducer };
