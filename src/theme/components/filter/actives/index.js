import './index.scss';
import { ElementsEventReducer } from '../../../utils/elements-event-reducer';

const SELECTORS = {
  FILTER: '[data-filter-active]',
  BUTTON: '[data-filter-active-button]',
};

const CLASSES = {
  ACTIVE: 'active',
};

class FilterActives {
  /**
   * @class FilterActives
   * @name FilterActives
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._elementsEventReducer = new ElementsEventReducer(this._container, {
      click: {
        [SELECTORS.BUTTON]: (event) => {
          event?.target?.classList.toggle(CLASSES.ACTIVE);
          this._container?.querySelector(SELECTORS.FILTER)?.classList.toggle(CLASSES.ACTIVE);
        },
      },
    });
  }

  /**
   * @method destroy
   */
  destroy() {
    this._elementsEventReducer.destroy();
  }
}

export { FilterActives };
