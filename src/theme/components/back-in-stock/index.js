const SELECTORS = {
  BACK_IN_STOCK_FORM: '[data-back-in-stock]',
  SUBMIT_BTN: '[data-submit]',
  NOTES: '[data-form-notes]',
};

export default class BackInStock {
  /**
   * @type {{visually_hidden: string}}
   * @private
   */
  _classes = {
    visually_hidden: 'visually-hidden',
  };

  /**
   * @param event
   * @returns {Promise<void>}
   * @private
   */
  _onBackInStockSubmit = async (event) => {
    event.preventDefault();
    this._notes.innerHTML = '';

    if ('BIS' in window) {
      const variantId = this._form.dataset.variantId;
      const productId = this._form.dataset.productId;

      try {
        const response = await window.BIS.create(this._form.email.value, variantId, productId);
        const message = response.status === 'OK' ? response.message : this._getResponseError(response.errors);
        this._setBisMessage(message);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  /**
   * @private
   */
  _onEmailInput = () => {
    this._submitButton.disabled = !this._form.email.checkValidity();
  };

  /**
   * @param message
   * @private
   */
  _setBisMessage = (message = '') => {
    this._notes.innerText = message;
    this._notes.classList.remove(this._classes.visually_hidden);
  };

  /**
   * @param errors
   * @returns {string}
   * @private
   */
  _getResponseError = (errors) => {
    let _error = '';
    Object.keys(errors).forEach((key) => {
      _error += errors[key].join(' ');
    });
    return _error;
  };

  /**
   * @param isVariantAvailable
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(isVariantAvailable, container = document) {
    this._form = container.querySelector(SELECTORS.BACK_IN_STOCK_FORM);

    if (!this._form) {
      return;
    }

    const _isVariantAvailable = isVariantAvailable ?? this._form.hasAttribute('hidden');

    if (_isVariantAvailable) {
      this._form.setAttribute('hidden', '');
    } else {
      this._form.removeAttribute('hidden');
    }
    this._form.addEventListener('submit', this._onBackInStockSubmit);
    this._form.email.addEventListener('input', this._onEmailInput);
    this._submitButton = container.querySelector(SELECTORS.SUBMIT_BTN);
    this._notes = container.querySelector(SELECTORS.NOTES);
  }

  /**
   * @public
   */
  setFocusOnEmail() {
    this._form.email.focus();
  }

  /**
   * @returns {string}
   * @public
   */
  getVariantId() {
    return this._form.dataset.variantId;
  }

  /**
   * @param variantId
   * @public
   */
  setVariantId(variantId) {
    this._form.dataset.variantId = variantId;
  }
}
