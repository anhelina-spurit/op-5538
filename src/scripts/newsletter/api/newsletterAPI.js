import { fetchAPI } from './apiCalls';

const BASE_URL = window.clientAPI.apiURL;
// todo verify when back-end is ready
// const QUERY_PARAMS = '?' + new URLSearchParams(PARAMS).toString();
const QUERY_PARAMS = '';

/** **********************
ENTRY POINT
************************/

export function postNewsletterAndGetFeedback(callback, body) {
  const newsletterRequestURL = `${BASE_URL}/newsletter${QUERY_PARAMS}`;
  return fetchAPI(newsletterRequestURL, callback, body);
}

export function unsubscribeNewsletter(callback, body) {
  const newsletterRequestURL = `${BASE_URL}/newsletter/unsubscribe`;
  return fetchAPI(newsletterRequestURL, callback, body);
}
