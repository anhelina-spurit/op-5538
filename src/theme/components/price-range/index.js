import noUiSlider from 'nouislider/dist/nouislider.min';
import 'nouislider/dist/nouislider.min.css';
import wNumb from 'wnumb';

import { Listeners } from '../../utils/listeners';

import './index.scss';

const SELECTORS = {
  GTE: '[data-price-gte]',
  LTE: '[data-price-lte]',
};

class PriceRange {
  /**
   * @class PriceRange
   * @name PriceRange
   *
   * @constructor
   * @param priceRange {HTMLElement|Element|Node|Object}
   * */
  constructor(priceRange) {
    this._priceRange = priceRange;
    this.gte = this._priceRange?.parentNode?.querySelector(SELECTORS.GTE);
    this.lte = this._priceRange?.parentNode?.querySelector(SELECTORS.LTE);
    this._listeners = new Listeners();
    this.instance = this._init();
    this._setListeners();
  }

  /**
   * @method destroy
   */
  destroy() {
    this._listeners.removeAll();
  }

  /**
   * @method reset
   */
  reset() {
    this.gte ? (this.gte.value = null) : null;
    this.gte ? (this.lte.value = null) : null;
    this.instance?.set([0, 1000]);
  }

  /**
   * @method _setListeners
   */
  _setListeners() {
    this.instance?.on('change', (event) => {
      this.gte.value = event[0];
      this.lte.value = event[1];
    });
  }

  /**
   * @method _init
   * @return Object|null
   */
  _init() {
    if (!this._priceRange) return null;
    return noUiSlider.create(this._priceRange, {
      tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
      range: {
        min: 0,
        max: 1000,
      },
      step: 10,
      start: [parseInt(this.gte.value, 10) || 0, parseInt(this.lte.value, 10) || 1000],
    });
  }
}

export { PriceRange };
