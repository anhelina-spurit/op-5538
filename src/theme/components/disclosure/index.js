import { Listeners } from '../../utils/listeners';
import { ElementsEventReducer } from '../../utils/elements-event-reducer';

import './index.scss';

const SELECTORS = {
  DISCLOSURE: '[data-disclosure]',
  TOGGLE: '[data-disclosure-toggle]',
  LIST: '[data-disclosure-list]',
};

const CLASSES = {
  VISIBLE: 'visible',
};

const ATTRIBUTES = {
  EXPANDED: 'aria-expanded',
};

const KEYS = {
  ESCAPE: 'Escape',
};

class Disclosure {
  constructor(disclosure) {
    /**
     * @class Disclosure
     * @name Disclosure
     *
     * @constructor
     * @param disclosure {HTMLElement}
     * */
    this._disclosure = disclosure;
    this._listeners = new Listeners();
    this._elementsEventReducer = new ElementsEventReducer(this._disclosure, {
      click: {
        [SELECTORS.TOGGLE]: () => {
          this._disclosure.querySelector(SELECTORS.LIST).classList.contains(CLASSES.VISIBLE)
            ? this.close()
            : this.open();
        },
      },
    });

    this._listeners.add(document, 'keyup', (event) => {
      event.key === KEYS.ESCAPE && this.close();
    });

    this._listeners.add(document, 'click', (event) => {
      !event.target.closest(SELECTORS.DISCLOSURE) && this.close();
    });
  }

  /**
   * @method destroy
   */
  destroy() {
    this._listeners.removeAll();
    this._elementsEventReducer.destroy();
  }

  /**
   * @method open
   */
  open() {
    this._disclosure.querySelector(SELECTORS.LIST).classList.add(CLASSES.VISIBLE);
    this._disclosure.querySelector(SELECTORS.TOGGLE).setAttribute(ATTRIBUTES.EXPANDED, true);
  }

  /**
   * @method close
   */
  close() {
    this._disclosure.querySelector(SELECTORS.LIST).classList.remove(CLASSES.VISIBLE);
    this._disclosure.querySelector(SELECTORS.TOGGLE).setAttribute(ATTRIBUTES.EXPANDED, false);
  }
}

export { Disclosure };
