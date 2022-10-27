import {postNewsletterAndGetFeedback, unsubscribeNewsletter} from './api/newsletterAPI';
import {
  displayAlreadySubscribedMessage,
  displayAlreadyUnsubscribedMessage,
  displayFailedMessage,
  displaySuccessMessage,
  hideAllFeedbackMessages,
} from './ui/newsletterRendering';

const NEWSLETTER_SELECTORS = {
  BLOCK_FORM: '#ozNewsletterForm--block',
  MODAL_FORM: '#ozNewsletterForm--modal',
  FORM: '#ozNewsletterForm',
  EMAIL_INPUT: '#ozNewsletterForm [name="contact[email]"]',
  UNSUBSCRIBE_FORM: '#contact_form',
  UNSUBSCRIBE_EMAIL_INPUT: '#contact_form [name="contact[email]"]'
};

/** **********************
CALLBACK
************************/

function displayNewsletterFeedback(form, data) {
  const result = data.result;
  switch (result) {
    case 'done':
      displaySuccessMessage(form);
      break;
    case 'failed':
      displayFailedMessage(form);
      break;
    case 'already_subscribed':
      displayAlreadySubscribedMessage(form);
      break;
    case 'already_unsubscribed':
      displayAlreadyUnsubscribedMessage(form);
      break;
  }
}

/** **********************
FUNCTIONAL
************************/

function onClickHideFeedbackMessages(form) {
  form.addEventListener('click', () => hideAllFeedbackMessages(form));
}

function onSubmitFetchAPI(form, isUnsubscribe) {
  const email = form.querySelector('[name="contact[email]"]')?.value;
  const language = document.documentElement.getAttribute('lang');
  if (!email || !language) return;
  const body = JSON.stringify({ email, locale: language });
  if(isUnsubscribe) {
    unsubscribeNewsletter(displayNewsletterFeedback.bind(null, form), body);
  } else {
    postNewsletterAndGetFeedback(displayNewsletterFeedback.bind(null, form), body);
  }
}

function initNewsletter(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onClickHideFeedbackMessages(form);
    onSubmitFetchAPI(form);
  });
}

function initUnsubscribeNewsletter(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmitFetchAPI(form, true);
  });
}

/** **********************
ENTRY POINT
************************/

export function initOzNewsletterModal() {
  const modalNewsletterForm = document.querySelector(NEWSLETTER_SELECTORS.MODAL_FORM);
  if (!modalNewsletterForm) return;
  initNewsletter(modalNewsletterForm);
}

export function initOzNewsletter() {
  const blockNewsletterForm = document.querySelector(NEWSLETTER_SELECTORS.BLOCK_FORM);
  if (!blockNewsletterForm) return;
  initNewsletter(blockNewsletterForm);
}

export function initUnsubscribeOzNewsletter() {
  const blockNewsletterForm = document.querySelector(NEWSLETTER_SELECTORS.UNSUBSCRIBE_FORM);
  if (!blockNewsletterForm) return;
  initUnsubscribeNewsletter(blockNewsletterForm);
}

