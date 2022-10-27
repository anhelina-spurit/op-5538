import keyBinder from 'tinykeys';

import { preventDefault } from '../../utils/prevent-default';
import { Collapse } from '../collapse';

import './accordion-item';

const SELECTORS = {
  BUTTON: '[data-collapse-button]',
};

/**
 * Class representing an accordion
 */
class Accordion {
  /**
   * @class Accordion
   * @name Accordion
   *
   * @constructor
   * @param {HTMLElement} accordion
   * */
  constructor(accordion) {
    this._elements = {
      accordion,
      buttons: accordion.querySelectorAll(SELECTORS.BUTTON),
    };

    keyBinder(
      this._elements.accordion,
      {
        ArrowUp: preventDefault(this._focusPreviousButton.bind(this)),
        ArrowDown: preventDefault(this._focusNextButton.bind(this)),
        Home: preventDefault(this._focusFirstButton.bind(this)),
        End: preventDefault(this._focusLastButton.bind(this)),
        PageUp: preventDefault(this._focusFirstButton.bind(this)),
        PageDown: preventDefault(this._focusLastButton.bind(this)),
      },
      {
        event: 'keyup',
      },
    );

    this._elements.buttons.forEach((button) => new Collapse(button));
  }

  /**
   * Destroy accordions
   * @method _destroyAccordion
   */
  destroyAccordion() {
    this._elements = null;
  }

  /**
   * Get buttons
   * @method _getButtons
   * @return HTMLElement[]
   */
  _getButtons() {
    return this._elements.accordion.querySelectorAll(SELECTORS.BUTTON);
  }

  /**
   * Find button index
   * @method _findButtonIndex
   * @param {HTMLElement[]} buttons
   * @param {HTMLElement} buttonToFind
   * @return number
   */
  _findButtonIndex(buttons, buttonToFind) {
    return buttons.findIndex((button) => button === buttonToFind);
  }

  /**
   * Focus previous button
   * @method _focusPreviousButton
   */
  _focusPreviousButton() {
    const buttons = this._getButtons();
    const activeButtonIndex = this._findButtonIndex(buttons, document.activeElement);

    if (activeButtonIndex < 0) return;

    const previousButtonIndex = activeButtonIndex;
    const lastButtonIndex = buttons.length - 1;
    const focusIndex = activeButtonIndex === 0 ? lastButtonIndex : previousButtonIndex;

    buttons[focusIndex].focus();
  }

  /**
   * Focus next button
   * @method _focusNextButton
   */
  _focusNextButton() {
    const buttons = this._getButtons();
    const activeButtonIndex = this._findButtonIndex(buttons, document.activeElement);

    if (activeButtonIndex < 0) return;

    const nextButtonIndex = activeButtonIndex + 1;
    const lastButtonIndex = buttons.length - 1;
    const focusIndex = activeButtonIndex === lastButtonIndex ? 0 : nextButtonIndex;

    buttons[focusIndex].focus();
  }

  /**
   * Focus first button
   * @method _focusFirstButton
   */
  _focusFirstButton() {
    const [firstButton] = this._getButtons();
    firstButton?.focus();
  }

  /**
   * Focus last button
   * @method _focusLastButton
   */
  _focusLastButton() {
    const buttons = this._getButtons();
    const lastButton = buttons[buttons.length - 1];
    lastButton?.focus();
  }
}

export { Accordion };
