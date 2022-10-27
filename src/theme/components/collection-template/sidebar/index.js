import MmenuLight from 'mmenu-light';
import 'mmenu-light/dist/mmenu-light.css';

import { Listeners } from '../../../utils/listeners';
import { ElementsEventReducer } from '../../../utils/elements-event-reducer';

import './index.scss';

const SELECTORS = {
  SIDEBAR: '[data-sidebar]',
  CONTROL: '[data-sidebar-control]',
  CLOSE: '[data-sidebar-close]',
};

class Sidebar {
  /**
   * @class Sidebar
   * @name Sidebar
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * @param filter {object}
   * */
  constructor(container = document, filter) {
    this._container = container;
    this._listeners = new Listeners();
    this._filter = filter;
    this._init();
    this._filter?.on('filter', this.close.bind(this));
    this._elementsEventReducer = new ElementsEventReducer(this._container, {
      click: {
        [SELECTORS.CONTROL]: () => {
          this.open();
        },
        [SELECTORS.CLOSE]: () => {
          this.close();
        },
      },
    });
  }

  /**
   * @method destroy
   */
  destroy() {
    this._listeners.removeAll();
    this._drawer.destroy();
  }

  /**
   * @method open
   */
  open() {
    this._drawer.open();
  }

  /**
   * @method close
   */
  close() {
    this._drawer.close();
  }

  /**
   * @method _init
   * @return boolean
   */
  _init() {
    const sidebar = document.querySelector(SELECTORS.SIDEBAR);
    if (sidebar) {
      const modal = new MmenuLight(sidebar);
      modal.offcanvas({
        position: 'left',
      });
      this._drawer = modal.offcanvas(undefined);
    }
    return true;
  }
}

export { Sidebar };
