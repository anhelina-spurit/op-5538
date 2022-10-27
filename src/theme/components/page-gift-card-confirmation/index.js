import { register } from '@shopify/theme-sections';

import GiftCardConfirmModal from '../gift-card-confirm';

register('gift-card-confirm', {
  onLoad() {
    const giftCardConfirmModal = new GiftCardConfirmModal();
    giftCardConfirmModal.showConfirmation();
  },
});
