import { register } from '@shopify/theme-sections';

import { Collection } from './collection';

import './index.scss';

register('collection', {
  _collection: null,

  onLoad() {
    this._collection = new Collection(this.container);
  },

  onUnload() {
    this._collection?.destroy();
  },
});
