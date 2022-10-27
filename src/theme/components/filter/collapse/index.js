import { Listeners } from '../../../utils/listeners';

import './index.scss';

const DATA_ATTRIBUTES = {
  CONTROLLED_BY: 'data-filter-collapse-controlled-by',
};

const CLASSES = {
  ACTIVE: 'active',
  HIDDEN: 'hidden',
};

class FilterCollapse {
  /**
   * @class FilterCollapse
   * @name FilterCollapse
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * @param collapse {HTMLElement|Element|Node|Object}
   * @param breakpoint {number|null}
   * */
  constructor(container, collapse = document, breakpoint = null) {
    this._container = container;
    this._collapse = collapse;
    this._button = this._container.querySelector(`#${collapse.getAttribute(DATA_ATTRIBUTES.CONTROLLED_BY)}`);
    this._breakpoint = breakpoint;
    this._listeners = new Listeners();

    this._listeners.add(this._button, 'click', () => {
      if (this._collapse.style.maxHeight) {
        this._collapse.style.maxHeight = null;
        this._button.classList.remove(CLASSES.ACTIVE);
      } else {
        this._collapse.style.maxHeight = `${this._collapse.scrollHeight}px`;
        this._button.classList.add(CLASSES.ACTIVE);
      }
    });
    this._handleCollapse();
    this._listeners.add(window, 'resize', this._handleCollapse.bind(this));
  }

  /**
   * @method destroy
   */
  destroy() {
    this._listeners.removeAll();
  }

  /**
   * @method _handleCollapse
   */
  _handleCollapse() {
    if (window.innerWidth <= this._breakpoint) {
      this._collapse.classList.add(CLASSES.HIDDEN);
      this._button.style.display = 'block';
      this._button.classList.contains(CLASSES.ACTIVE)
        ? (this._collapse.style.maxHeight = `${this._collapse.scrollHeight}px`)
        : null;
    } else {
      this._collapse.classList.remove(CLASSES.HIDDEN);
      this._button.style.display = 'none';
    }
  }
}

export { FilterCollapse };
