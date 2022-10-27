import { register } from '@shopify/theme-sections';
import debounce from 'lodash.debounce';

import { initTabs } from '../tabs';
import { initProductSlider } from '../product-slider';

import './index.scss';

const BREAKPOINT = 991;

register('cross-sell', {
  _turnOffTabs() {
    this?.container?.querySelectorAll('[role="tabpanel"]').forEach((tabpanel) => tabpanel.removeAttribute('hidden'));
  },
  _initTabs() {
    initTabs();
    this?.container?.querySelectorAll('[role="tabpanel"]')?.forEach((tabpanel) => {
      const isSelected =
        this?.container.querySelector(`[href="#${tabpanel.id}"]`)?.getAttribute('aria-selected') === 'true';
      if (isSelected) {
        tabpanel.removeAttribute('hidden');
      } else {
        tabpanel.hidden = true;
      }
    });
  },
  _handleWindowResize() {
    if (window.innerWidth > BREAKPOINT) {
      this?._initTabs();
    } else {
      this?._turnOffTabs();
    }
  },

  _init() {
    window.innerWidth > BREAKPOINT ? initTabs() : this._turnOffTabs();
    this._sliders = initProductSlider();
  },

  _destroy() {
    this._sliders.forEach((slider, index) => {
      slider?.destroy;
      this._sliders[index] = null;
      slider?.scrollbar.destroy();
    });
  },

  onLoad() {
    this?._init();
    window.addEventListener('resize', debounce(this._handleWindowResize.bind(this), 300));
  },

  onUnload() {
    this._destroy();
  },
});
