import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import './index.scss';

/* eslint-disable no-undef */
lazySizes.cfg.lazyClass = 'lazy--initial';
lazySizes.cfg.preloadClass = 'lazy--preload';
lazySizes.cfg.loadedClass = 'lazy--loaded';
lazySizes.cfg.loadingClass = 'lazy--loading';
lazySizes.cfg.errorClass = 'lazy--error';
lazySizes.cfg.autosizesClass = 'lazy--autosizes';
lazySizes.cfg.fastLoadedClass = 'lazy--cached';
/* eslint-enable no-undef */
