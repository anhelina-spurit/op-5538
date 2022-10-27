import { editDetailsAndGetFeedback, getPersonalDetailsAndPopulate } from './api/clientAPI';
import {
  renderClientNumber,
  renderDetailsForm,
  renderLoyaltyPoints,
  renderSubscriptions,
} from './ui/personalDetailsRendering';
import { clDebug, getJSON, showErrorFeedback, showSuccessFeedback } from './utils';

/*
UTILS
************************/

function getFormJSONData(form, testMode) {
  const formData = new FormData(form);
  clDebug(testMode, `*** (getDetailsData) :: formData: ${getJSON(formData)}`);

  return getJSON(formData);
}

/*
CALLBACKS
************************/

function displayFeedback(data, feedbackPlaceholder, successCallback = null, errorCallback = null) {
  if (data) {
    showSuccessFeedback(feedbackPlaceholder, successCallback);
  } else {
    showErrorFeedback(feedbackPlaceholder, errorCallback);
  }
}

function displayFeedbackDetailsEdited(data) {
  const feedbackPlaceholder = document.querySelector('#account--details__form .feedback');
  displayFeedback(data, feedbackPlaceholder);
}

function displayFeedbackSubscriptionsEdited(data) {
  const feedbackPlaceholder = document.querySelector('#account--subscriptions__form .subscriptions__form-section--feedback');
  displayFeedback(data, feedbackPlaceholder, (feedbackContainer) => {
    const form = feedbackContainer.closest('#account--subscriptions__form');

    const checkboxesSection = form.querySelector('.subscriptions__form-section--checkboxes')
    const mobilePhoneSection = form.querySelector('.subscriptions__form-section--phone');
    const submitButton = form.querySelector('.subscriptions__form-submit');

    checkboxesSection.classList.add('hidden');
    mobilePhoneSection.classList.add('hidden');
    submitButton.classList.add('hidden');
  });
}

function initDetailsAndEditing(data) {
  renderClientNumber(data);
  renderDetailsForm(data);
  renderSubscriptions(data);
  renderLoyaltyPoints(data);
}

/*
INITIALISATION
************************/

function getSubscriptionValues(subscriptionsForm, mobilePhoneInput) {
  const marketingSMSValue = subscriptionsForm.elements.marketingSMS.checked.toString();
  const emailValue = subscriptionsForm.elements.marketingEmail.checked.toString();
  const subscriptionsValues = { marketingSMS: marketingSMSValue, marketingEmail: emailValue };
  if (mobilePhoneInput.value) subscriptionsValues.mobilePhoneNumber = mobilePhoneInput.value;
  return subscriptionsValues;
}

function initEditSubscriptions(testMode) {
  const subscriptionsForm = document.getElementById('account--subscriptions__form');

  subscriptionsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isMarketingSMSOpted = subscriptionsForm.elements.marketingSMS.checked;
    const storedMobilePhoneNumber = subscriptionsForm.getAttribute('data-mobile-phone');
    const mobilePhoneInput = subscriptionsForm.querySelector('#mobilePhoneNumber');
    if (isMarketingSMSOpted && !storedMobilePhoneNumber && !mobilePhoneInput.value) {
      // Display mobile phone missing message
      const mobilePhoneSection = subscriptionsForm.querySelector('.subscriptions__form-section--phone');
      const checkboxesSection = subscriptionsForm.querySelector('.subscriptions__form-section--checkboxes');
      checkboxesSection.classList.add('hidden');
      mobilePhoneSection.classList.remove('hidden');
      return;
    }

    const body = getSubscriptionValues(subscriptionsForm, mobilePhoneInput);
    editDetailsAndGetFeedback(testMode, displayFeedbackSubscriptionsEdited, JSON.stringify(body));
  });
}

function initEditDetails(testMode) {
  const detailsForm = document.getElementById('account--details__form');

  detailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const detailsDataStr = getFormJSONData(detailsForm, testMode);
    editDetailsAndGetFeedback(testMode, displayFeedbackDetailsEdited, detailsDataStr);
  });
}

function displayDetails(testMode) {
  getPersonalDetailsAndPopulate(testMode, initDetailsAndEditing);
}

/** *********************
ENTRY POINT
************************/

export function initPersonalDetails(testMode) {
  displayDetails(testMode);
  initEditDetails(testMode);
  initEditSubscriptions(testMode);
}
