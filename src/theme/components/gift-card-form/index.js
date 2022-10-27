import { Modal } from '../modal';
import './index.scss';

const SELECTORS = {
  FORM: '.gift-card-form',
  CONFIRM_MODAL: '.gift-card-confirm',
  DATE_INPUT: '.gift-card-form__input--date',
  SUM_SELECT: '.gift-card-form__select',
  FINAL_SUM: '[data-gift-card-sum]',
};

class GiftCardForm {
  constructor() {
    this.form = document.querySelector(SELECTORS.FORM);
    this.form.addEventListener('submit', this._onSubmitHandler.bind(this));
    this.modal = new Modal(document.querySelector(SELECTORS.CONFIRM_MODAL));
    this.dateInput = this.form.querySelector(SELECTORS.DATE_INPUT);
    this.dateInput && this._initDateRange();
  }

  _initDateRange() {
    const currentDate = new Date();
    this.dateInput.setAttribute('min', currentDate.toISOString().substring(0, 10));
  }

  _onSubmitHandler(event) {
    event.preventDefault();

    // const formData = new FormData(this.form);
    // API call
    // and etc.
    const sum = this.form.querySelector(SELECTORS.SUM_SELECT).value;
    document.querySelector(SELECTORS.FINAL_SUM).innerHTML = sum;

    this._showConfirm();
  }

  _showConfirm() {
    this.modal.show();
  }
}

export default GiftCardForm;
