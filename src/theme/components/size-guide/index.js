import { register } from '@shopify/theme-sections';

import { SizeGuide } from './content';
import './content/index.scss';
import './title/index.scss';

register('size-guide', {
  _initSizeGuide() {
    this._sizeGuide = new SizeGuide(this.container);
  },

  onLoad() {
    this._initSizeGuide();
  },
});
