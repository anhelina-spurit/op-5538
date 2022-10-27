import { register } from '@shopify/theme-sections';

import { initOzNewsletterModal } from '../../../scripts/newsletter';
import { Modal } from '../modal';
import './index.scss';

const STORAGE_KEY = 'wasNewsletterModalShown';

register('newsletter-modal', {
  _wasShown() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  },

  _onHide() {
    localStorage.setItem(STORAGE_KEY, 'true');
  },

  _initModal() {
    const modalElement = document.getElementById('newsletter-modal__modal');
    this._modal = new Modal(modalElement, {
      callbacks: {
        onHide: this._onHide,
      },
    });
  },

  onLoad() {
    if (this._wasShown() && !Shopify.designMode) return;
    this._initModal();
    initOzNewsletterModal();
    const delay = this._modal.elements.modal.dataset.delay;
    if (!Shopify.designMode) {
      setTimeout(() => this?._modal?.show(), Number(delay) * 1000);
    }
  },

  onSelect() {
    this._modal?.show();
  },

  onDeselect() {
    this._modal?.hide();
  },
});
