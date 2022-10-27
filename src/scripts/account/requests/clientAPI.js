const BASE_URL = window.clientAPI.apiURL;
const CUSTOMER_ID = window.clientAPI.customerID;

// todo verify when back-end is ready
// const QUERY_PARAMS = '?' + new URLSearchParams(PARAMS).toString();
const QUERY_PARAMS = '';

export const getContactsRequestURL = () => {
  return `${BASE_URL}/client/${CUSTOMER_ID}/contacts${QUERY_PARAMS}`;
};

export const deleteContactRequestURL = (childId) => {
  return `${BASE_URL}/client/${CUSTOMER_ID}/contact/${childId}${QUERY_PARAMS}`;
};

export const putContactRequestURL = (childId) => {
  return `${BASE_URL}/client/${CUSTOMER_ID}/contact/${childId}${QUERY_PARAMS}`;
};

export const postContactRequestURL = () => {
  return `${BASE_URL}/client/${CUSTOMER_ID}/contact${QUERY_PARAMS}`;
};

export const getPersonalDetailsRequestURL = () => {
  return `${BASE_URL}/client/${CUSTOMER_ID}${QUERY_PARAMS}`;
};

export const putPersonalDetailsRequestURL = () => {
  return `${BASE_URL}/client/${CUSTOMER_ID}${QUERY_PARAMS}`;
};

export const loginRequestURL = () => {
  return `${BASE_URL}/client/login`;
};

export const resetRequestURL = () => {
  return `${BASE_URL}/client/reset`;
};
