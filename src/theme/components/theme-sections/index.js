import { load } from '@shopify/theme-sections';

import { onDOMReady } from '../../utils/on-dom-ready';

import './index.scss';

onDOMReady(() => load('*'));
