import { Selectbox } from '../../selectbox';
import { Listeners } from '../../../utils/listeners';
import './index.scss';

const SELECTORS = {
  SELECTBOX: '.selectbox',
  SELECT: '.selectbox__select',
  OPTION: '[role="option"]',
};

const ATTRIBUTES = {
  ITEM: 'data-filter-sub-form-item',
  OPTION_VALUE: 'data-option-value',
};
const CLASSES = {
  ACTIVE: 'active',
};

class SubFilter {
  /**
   * @class SubFilter
   * @name SubFilter
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._listeners = new Listeners();
    this._selectboxElem = this._container?.querySelector(SELECTORS.SELECTBOX);
    this._options = this._container?.querySelectorAll(SELECTORS.OPTION);
    this._items = this._container?.querySelectorAll(`[${ATTRIBUTES.ITEM}]`);
    this._selectbox = this._selectboxElem ? new Selectbox(this._selectboxElem) : null;
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
    this._selectbox?.setSelectBox(this._options[this._options.length - 1]);
  }

  /**
   * @method _handleChange
   * @param event {Event}
   */
  _handleChange(event) {
    const value = event.target.querySelector(SELECTORS.SELECT).value;
    this._items.forEach((item) => {
      item.getAttribute(ATTRIBUTES.ITEM) === value
        ? item.classList.add(CLASSES.ACTIVE)
        : item.classList.remove(CLASSES.ACTIVE);
    });
  }

  /**
   * @method _handleClick
   * @param event {Event}
   */
  _handleClick(event) {
    const value = event.target.getAttribute(ATTRIBUTES.ITEM);
    this._options.forEach((option) => {
      value === option.getAttribute(ATTRIBUTES.OPTION_VALUE) ? this._selectbox?.setSelectBox(option) : null;
    });
  }

  /**
   * @method _setListeners
   */
  _setListeners() {
    this._listeners.add(this._container?.querySelector(SELECTORS.SELECTBOX), 'change', this._handleChange.bind(this));
    this._items?.forEach((item) => this._listeners.add(item, 'click', this._handleClick.bind(this)));
  }
}

export { SubFilter };
