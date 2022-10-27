import { register } from '@shopify/theme-sections';

import { Selectbox } from '../../selectbox';

import './index.scss';

const SELECTORS = {
  SELECTBOX: '.selectbox',
};

register('commitments-hero', {
  _onSelectboxChange(event) {
    const option = event.target.querySelector('[role="option"][aria-selected="true"]');

    if (!option) return;

    const optionValue = option.getAttribute('data-option-value');
    document.getElementById(optionValue)?.scrollIntoView();
  },

  onLoad() {
    const selectbox = this.container.querySelector(SELECTORS.SELECTBOX);

    if (selectbox) {
      this._selectbox = new Selectbox(selectbox);
      selectbox.addEventListener('change', this._onSelectboxChange.bind(this));
    }
  },
});
