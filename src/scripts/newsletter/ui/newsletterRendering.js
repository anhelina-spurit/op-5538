const HIDDEN_CLASS = 'hidden';

const NEWSLETTER_SELECTORS = {
  FEEDBACK_MESSAGE: '.newsletter-form__message',
  SUCCESS_MESSAGE: '.newsletter-form__message--success',
  FAIL_MESSAGE: '.newsletter-form__message--failed',
  ALREADY_SUBSCRIBED_MESSAGE: '.newsletter-form__message--already_subscribed',
  ALREADY_UNSUBSCRIBED_MESSAGE: '.newsletter-form__message--already_unsubscribed',
};

export function hideAllFeedbackMessages(form, exceptionSelector = null) {
  const feedbackMessages = form.querySelectorAll(
    `${NEWSLETTER_SELECTORS.FEEDBACK_MESSAGE}${exceptionSelector ? `:not(${exceptionSelector}` : ''}`,
  );
  feedbackMessages.forEach((message) => message.classList.add(HIDDEN_CLASS));
}

export function displaySuccessMessage(form) {
  const successMessage = form.querySelector(NEWSLETTER_SELECTORS.SUCCESS_MESSAGE);
  hideAllFeedbackMessages(form, NEWSLETTER_SELECTORS.SUCCESS_MESSAGE);
  successMessage.classList.remove(HIDDEN_CLASS);
}

export function displayFailedMessage(form) {
  const failedMessage = form.querySelector(NEWSLETTER_SELECTORS.FAIL_MESSAGE);
  hideAllFeedbackMessages(form, NEWSLETTER_SELECTORS.FAIL_MESSAGE);
  failedMessage.classList.remove(HIDDEN_CLASS);
}

export function displayAlreadySubscribedMessage(form) {
  const alreadySubscribedMessage = form.querySelector(NEWSLETTER_SELECTORS.ALREADY_SUBSCRIBED_MESSAGE);
  hideAllFeedbackMessages(form, NEWSLETTER_SELECTORS.ALREADY_SUBSCRIBED_MESSAGE);
  alreadySubscribedMessage.classList.remove(HIDDEN_CLASS);
}

export function displayAlreadyUnsubscribedMessage(form) {
  const alreadyUnsubscribedMessage = form.querySelector(NEWSLETTER_SELECTORS.ALREADY_UNSUBSCRIBED_MESSAGE);
  hideAllFeedbackMessages(form, NEWSLETTER_SELECTORS.ALREADY_UNSUBSCRIBED_MESSAGE);
  alreadyUnsubscribedMessage.classList.remove(HIDDEN_CLASS);
}
