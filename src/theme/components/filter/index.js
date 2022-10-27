import EventEmitter from 'eventemitter3';

import { ElementsEventReducer } from '../../utils/elements-event-reducer';
import { PriceRange } from '../price-range';
import { preventDefault } from '../../utils/prevent-default';
import { serializeFormData } from '../../utils/serialize-form-data';

import { SubFilter } from './horizontal';
import { FilterActives } from './actives';
import { FilterCollapse } from './collapse';

import './navigation';
import './index.scss';

const SELECTORS = {
  FORM: '[data-filter-form]',
  SUB_FORM: '[data-filter-sub-form]',
  RESET: '[data-filter-reset]',
  RESET_ITEM: '[data-filter-reset-item]',
  CONTROL: '[data-filter-control]',
  PRICE_RANGE: '#price-range',
  COLLAPSE: '[data-filter-collapse]',
};

/** Class representing a "Facets filter" */
class Filter extends EventEmitter {
  /**
   * @class Filter
   * @name Filter
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    super();
    this._container = container;
    this._form = this._container.querySelector(SELECTORS.FORM);
    this._subform = this._container.querySelector(SELECTORS.SUB_FORM);
    this.priceRange = new PriceRange(this._container.querySelector(SELECTORS.PRICE_RANGE));
    this.activeFilters = new FilterActives(this._container);
    this.subFilter = new SubFilter(this._subform);
    this._collapses = [];
    this._container.querySelectorAll(SELECTORS.COLLAPSE)?.forEach((item) => {
      this._collapses = [...this._collapses, new FilterCollapse(this._container, item, 768)];
    });
    this._elementsEventReducer = new ElementsEventReducer(this._container, {
      submit: {
        [SELECTORS.FORM]: preventDefault(() => this.emit('filter', this.getParams())),
      },
      change: {
        [SELECTORS.SUB_FORM]: preventDefault(() => this.emit('filter', this.getParams())),
      },
      click: {
        [SELECTORS.RESET]: () => {
          this.reset();
          return this.emit('filter', this.getParams());
        },
        [SELECTORS.RESET_ITEM]: (event) => {
          this.resetItem(event);
          return this.emit('filter', this.getParams());
        },
      },
    });
  }

  /**
   * @method reset
   */
  reset() {
    this.priceRange.reset();
    this._form.querySelectorAll(SELECTORS.CONTROL)?.forEach((item) => (item.checked = false));
    this.subFilter.reset();
  }

  /**
   * @method destroy
   * @param event {Event}
   */
  resetItem(event) {
    const { target } = event;
    const name = target.closest(SELECTORS.RESET_ITEM)?.name;
    const value = target.closest(SELECTORS.RESET_ITEM)?.dataset?.filterResetItem;
    if (name === 'price_range') {
      this.priceRange.reset();
      return;
    }

    this._form.querySelectorAll(SELECTORS.CONTROL)?.forEach((item) => {
      item.name === name && item.value === value ? (item.checked = false) : null;
    });
  }

  /**
   * @method destroy
   */
  destroy() {
    this._elementsEventReducer.destroy();
    this.activeFilters.destroy();
    this.priceRange.destroy();
    this.subFilter.destroy();
  }

  /**
   * @method getParams
   * @return {Object|null} Object with form data.
   */
  getParams() {
    const formJSON = this._form ? serializeFormData(this._form, true) : null;
    const subFormJSON = this._subform ? serializeFormData(this._subform, true) : null;
    return formJSON && subFormJSON ? Object.assign(formJSON, subFormJSON) : null;
  }
}

export { Filter };
