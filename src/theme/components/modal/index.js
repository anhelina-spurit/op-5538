import * as focusTrap from 'focus-trap/dist/focus-trap.esm';
import './index.scss';

/**
 * Modal
 */
class Modal {
  /**
   * Constructor
   * @param {HTMLElement} element
   * @param {Object} options - modal options
   * @param {HTMLElement} options.setReturnFocus - element to programmatically
   *   receive focus after deactivation
   * @param {Object} options.callbacks - modal events callbacks
   * @param {function} options.callbacks.onShow - сallback on opening event
   * @param {function} options.callbacks.onAfterShow - сallback after opening
   *   event
   * @param {function} options.callbacks.onHide - сallback on hiding event
   * @param {function} options.callbacks.onAfterHide - сallback after hiding
   *   event
   */
  constructor(element, options = {}) {
    this.initConstants(options);
    this.initElements(element, options);
    this.initCallbacks(options.callbacks);
    this.initDelays();
    this.createFocusTrap();
    this.bindHandlers();
  }

  /**
   * @method initConstants
   */
  initConstants() {
    this.CONSTANTS = {
      CLASSES: {
        VISIBLE: 'modal--visible',
        ACTIVE: 'modal--active',
      },
      SELECTORS: {
        MODAL_CLOSE: '[data-modal-close]',
        MODAL_INITIAL_FOCUS: '[data-modal-inital-focus]',
      },
      KEY_CODES: {
        ESCAPE: 'Escape',
        ENTER: 'Enter',
        SPACE: 'Space',
      },
      DELAYS: {
        ANIMATION: 600,
        ACTIVATION: 50,
      },
      MILLISECONDS_IN_SECOND: 1000,
    };
  }

  /**
   * @method initElements
   * @param {HTMLElement} element
   * @param {Object} options
   * @param {HTMLElement} options.setReturnFocus
   */
  initElements(element, options) {
    this.elements = {
      html: document.documentElement,
      body: document.body,
      modal: element,
      initialFocus: element.querySelector(this.CONSTANTS.SELECTORS.MODAL_INITIAL_FOCUS),
      setReturnFocus: options.setReturnFocus,
      isFocus: options.isFocus === false ? options.isFocus : true,
      isOverflow: options.isOverflow === false ? options.isOverflow : true,
    };
  }

  /**
   * @method cssTimeToMilliseconds
   * @param {string} time - css time
   */
  cssTimeToMilliseconds(time) {
    const timeNumber = Number.parseFloat(time);

    let unit = time.match(/m?s/);
    let milliseconds = 0;

    if (unit) {
      unit = unit[0];
    }

    switch (unit) {
      case 's': {
        milliseconds = timeNumber * this.CONSTANTS.MILLISECONDS_IN_SECOND;
        break;
      }

      case 'ms': {
        milliseconds = timeNumber;
        break;
      }
    }

    return milliseconds;
  }

  /**
   * @method initConstants
   */
  initDelays() {
    const modalTransitionDelay = window
      .getComputedStyle(this.elements.modal)
      .getPropertyValue('--modal-transition-delay');

    this.delays = {
      animation: modalTransitionDelay
        ? this.cssTimeToMilliseconds(modalTransitionDelay)
        : this.CONSTANTS.DELAYS.ANIMATION,
      activation: this.CONSTANTS.DELAYS.ACTIVATION,
    };
  }

  /**
   * @method initCallbacks
   * @param {Object} callbacks - modal events callbacks
   * @param {function} callbacks.onShow - сallback on opening event
   * @param {function} callbacks.onAfterShow - сallback on opening event
   * @param {function} callbacks.onHide - сallback on hiding event
   * @param {function} callbacks.onAfterHide - сallback on hiding event
   */
  initCallbacks(callbacks) {
    this.callbacks = {
      onShow: () => {}, // eslint-disable-line no-empty-function
      onAfterShow: () => {}, // eslint-disable-line no-empty-function
      onHide: () => {}, // eslint-disable-line no-empty-function
      onAfterHide: () => {}, // eslint-disable-line no-empty-function
    };

    if (callbacks) {
      Object.keys(callbacks).forEach((callbackName) => {
        const callback = callbacks[callbackName];

        if (typeof callback === 'function') {
          this.callbacks[callbackName] = callback;
        }
      });
    }
  }

  /**
   * @method isVisible
   */
  isVisible() {
    return this.elements.modal.classList.contains(this.CONSTANTS.CLASSES.VISIBLE);
  }

  /**
   * @method disablePageScroll
   */
  disableBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  /**
   * @method enableBodyScroll
   */
  enableBodyScroll() {
    document.body.style.overflow = null;
  }

  /**
   * @method show
   */
  show() {
    if (this.isVisible()) {
      return;
    }

    clearTimeout(this.activityTimeout);
    if (this.elements.isOverflow) {
      this.disableBodyScroll();
    }
    this.elements.modal.classList.add(this.CONSTANTS.CLASSES.VISIBLE);

    this.activityTimeout = setTimeout(() => {
      this.elements.modal.classList.add(this.CONSTANTS.CLASSES.ACTIVE);
      this.callbacks.onShow();
      if (this.elements.isFocus) {
        this.focusTrap.activate();
      }
      setTimeout(() => {
        this.callbacks.onAfterShow();
      }, this.delays.animation);
    }, this.delays.activation);
  }

  /**
   * @method hide
   */
  hide() {
    if (!this.isVisible()) {
      return;
    }

    clearTimeout(this.activityTimeout);
    this.elements.modal.classList.remove(this.CONSTANTS.CLASSES.ACTIVE);
    this.callbacks.onHide();

    this.activityTimeout = setTimeout(() => {
      this.enableBodyScroll(this.elements.modal);
      this.elements.modal.classList.remove(this.CONSTANTS.CLASSES.VISIBLE);
      if (this.elements.isFocus) {
        this.focusTrap.deactivate();
      }
      this.callbacks.onAfterHide();
    }, this.delays.animation);
  }

  /**
   * @method createFocusTrap
   */
  createFocusTrap() {
    const options = {
      initialFocus: this.elements.initialFocus,
      fallbackFocus: this.elements.modal,
      escapeDeactivates: false,
      allowOutsideClick: true,
    };

    if (this.elements.setReturnFocus) {
      options.setReturnFocus = this.elements.setReturnFocus;
    }

    if (this.elements.isFocus) {
      this.focusTrap = focusTrap.createFocusTrap(this.elements.modal, options);
    }
  }

  /**
   * @method keyupHandler
   * @param {KeyboardEvent} event
   */
  keyupHandler(event) {
    switch (event.code) {
      case this.CONSTANTS.KEY_CODES.ESCAPE: {
        event.preventDefault();
        this.hide();
        break;
      }
    }
  }

  /**
   * @method isModalClose
   * @param {HTMLElement} element
   */
  isModalClose(element) {
    return element.matches(this.CONSTANTS.SELECTORS.MODAL_CLOSE);
  }

  /**
   * @method handleModalClick
   * @param {Event} event
   */
  handleModalClick(event) {
    if (this.isModalClose(event.target)) {
      this.hide();
    }
  }

  /**
   * @method bindHandlers
   */
  bindHandlers() {
    this.elements.modal.addEventListener('click', this.handleModalClick.bind(this));
    this.elements.modal.addEventListener('keyup', this.keyupHandler.bind(this));
  }

  /**
   * @method getElement
   * @return {HTMLElement}
   */
  getElement() {
    return this.elements.modal;
  }
}

export { Modal };
