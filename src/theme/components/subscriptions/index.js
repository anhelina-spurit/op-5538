import { register } from '@shopify/theme-sections';
import './index.scss';

class Subscriptions {
  /**
   *
   * @param options
   */
  constructor(options) {
    /**
     *
     * @type {{section: string, classNameForm: string}}
     */
    const defaultProps = {
      section: '[data-section-type="account"]',
      classNameForm: '.subscriptions__form',
    };

    /**
     *
     * @type {*&{section: string, classNameForm: string}}
     * @private
     */
    this._options = { ...defaultProps, ...options };

    /**
     *
     * @type {any}
     * @private
     */
    this._section = document.querySelector(this._options.section);
    /**
     *
     * @type {*|null}
     * @private
     */
    this._form = this._section ? this._section.querySelector(this._options.classNameForm) : null;

    /**
     *
     * @type {{onSubmitHandler: *}}
     * @private
     */
    this._handles = {
      onSubmitHandler: this.onSubmitHandler.bind(this),
    };
  }

  init() {
    if (this._form) {
      this._form.addEventListener('submit', this._handles.onSubmitHandler);
    }
  }

  destroy() {
    if (this._form) {
      this._form.removeEventListener('submit', this._handles.onSubmitHandler);
    }
  }

  /**
   *
   * @param event
   */
  onSubmitHandler(event) {
    event.preventDefault();
  }
}

/**
 *
 * @type {Subscriptions}
 */
const subscriptions = new Subscriptions();

register('subscriptions', {
  onLoad() {
    subscriptions.init();
  },
  onUnload() {
    subscriptions.destroy();
  },
});
