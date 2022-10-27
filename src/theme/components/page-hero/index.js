import { register } from '@shopify/theme-sections';

import VideoBlock from '../video';

import './index.scss';

const SELECTORS = {
  VIDEO: '[data-video-settings]',
};

register('page-hero', {
  onLoad() {
    const video = this.container?.querySelector(SELECTORS.VIDEO);
    if (!video) return;
    this._video = new VideoBlock({
      video,
    });
  },
});
