import { register } from '@shopify/theme-sections';

import { CollectionsPreviewSlider } from '../collections-preview-slider';
import { CollectionsPreviewModal } from '../collection-preview-modal';
import { ProductCard } from '../product-card';

import './index.scss';

register('collections-preview', {
  collectionPreviewSlider: null,
  collectionPreviewModal: null,
  productCards: null,

  onLoad() {
    this.collectionPreviewSlider = new CollectionsPreviewSlider(this?.container);
    this.collectionPreviewModal = new CollectionsPreviewModal(this?.container);
    this.productCards = new ProductCard(this?.container);
  },
  onUnload() {
    this?.collectionPreviewSlider?.destroy();
    this?.collectionPreviewModal?.destroy();
    this?.productCards?.destroy();
  },
});
