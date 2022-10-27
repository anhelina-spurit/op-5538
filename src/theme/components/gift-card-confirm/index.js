import { Modal } from '../modal';
import './index.scss';

class GiftCardConfirmModal {
  constructor() {
    this.modal = new Modal(document.getElementById('gift-card-modal'));
  }

  showConfirmation() {
    this.modal.show();
  }

  hideConfirmation() {
    this.modal.hide();
  }
}

export default GiftCardConfirmModal;
