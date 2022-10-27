import { shopifyLoginRequestURL, shopifyRecoverRequestURL, shopifyRegisterRequestURL } from '../requests/shopifyAPI';

import { fetchAPI } from './apiCalls';

export function shopifyLogin(callback, formData) {
  fetchAPI(shopifyLoginRequestURL(), callback, 'POST', formData);
}

export function shopifyRegister(callback, formData) {
  fetchAPI(shopifyRegisterRequestURL(), callback, 'POST', formData);
}

export function shopifyRecover(callback, formData) {
  fetchAPI(shopifyRecoverRequestURL(), callback, 'POST', formData);
}
