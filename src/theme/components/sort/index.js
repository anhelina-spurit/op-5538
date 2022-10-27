import EventEmitter from 'eventemitter3';

import { ElementsEventReducer } from '../../utils/elements-event-reducer';

import { SortModal } from './modal';

import './index.scss';

const SELECTORS = {
  SORT_INPUT: '[data-sort-control]',
};

/** Class representing a "Sort" */
class Sort extends EventEmitter {
  /**
   * @class Sort
   * @name Sort
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    super();
    this._container = container;
    this._elementsEventReducer = new ElementsEventReducer(this._container, {
      change: {
        [SELECTORS.SORT_INPUT]: () => this.emit('sort', this.getType()),
      },
    });
    this.sortModal = new SortModal(this._container);
  }

  /**
   * @method destroy
   */
  destroy() {
    this._elementsEventReducer?.destroy();
    this.sortModal?.destroy();
  }

  /**
   * @method getType
   */
  getType() {
    const selectedInput = this._container?.querySelector(`${SELECTORS.SORT_INPUT}:checked`);
    return selectedInput?.value;
  }
}

export { Sort };
