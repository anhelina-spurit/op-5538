import { getMockAddChild, getMockChildren, getMockEditChild } from '../mocks/childrenMock';
import { getMockPersonalDetails } from '../mocks/personalDetailsMock';
import * as clientRequests from '../requests/clientAPI';

import { fetchAPI } from './apiCalls';

/************************
PREPARE AND SEND REQUESTS
************************/

function getChildren(callback) {
  fetchAPI(clientRequests.getContactsRequestURL(), callback, 'GET', null, 4);
}

function removeChild(childID, callback) {
  fetchAPI(clientRequests.deleteContactRequestURL(childID), callback, 'DELETE', null);
}

function addChild(callback, body) {
  fetchAPI(clientRequests.postContactRequestURL(), callback, 'POST', body);
}

function editChild(childID, callback, body) {
  fetchAPI(clientRequests.putContactRequestURL(childID), callback, 'PUT', body);
}

function getDetails(callback) {
  fetchAPI(clientRequests.getPersonalDetailsRequestURL(), callback, 'GET', null, 4);
}

function editPersonalDetails(callback, body) {
  fetchAPI(clientRequests.putPersonalDetailsRequestURL(), callback, 'PUT', body);
}

function notifyClientAPIOfLogin(callback, body) {
  fetchAPI(clientRequests.loginRequestURL(), callback, 'POST', body);
}

function notifyClientAPIOfRecover(callback, body) {
  fetchAPI(clientRequests.resetRequestURL(), callback, 'POST', body);
}

/************************
EXPORTS - CHILDREN
************************/

export function addChildAndGetFeedback(testMode, callback, body) {
  return testMode ? callback(getMockAddChild(body), true) : addChild(callback, body);
}

export function getChildrenAndPopulate(testMode, callback) {
  return testMode ? callback(getMockChildren(), true) : getChildren(callback);
}

export function removeChildAndGetFeedback(testMode, childID, callback) {
  return testMode ? callback() : removeChild(childID, callback);
}

export function editChildAndGetFeedback(testMode, childID, callback, body) {
  return testMode ? callback(getMockEditChild(body, childID), true) : editChild(childID, callback, body);
}

/************************
EXPORTS - PERSONAL DETAILS
************************/

export function getPersonalDetailsAndPopulate(testMode, callback) {
  return testMode ? callback(getMockPersonalDetails()) : getDetails(callback);
}

export function editDetailsAndGetFeedback(testMode, callback, body) {
  return testMode ? callback(getMockPersonalDetails(body)) : editPersonalDetails(callback, body);
}

/************************
EXPORTS - LOGIN / REGISTER
************************/

export function notifyClientAPIThenCallShopify(testMode, callback, formData) {
  const body = JSON.stringify({
    email: formData.get('customer[email]'),
    password: formData.get('customer[password]')
  });

  return testMode ? callback(formData) : notifyClientAPIOfLogin(callback, body);
}


export function notifyClientAPIResetThenCallShopify(testMode, callback, formData) {
  const body = JSON.stringify({
    email: formData.get('email')
  });

  return testMode ? callback(formData) : notifyClientAPIOfRecover(callback, body);
}
