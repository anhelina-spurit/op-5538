export const templateAPI = {
  get(handle) {
    return fetch(`${handle}`).then((response) => response.text());
  },
};
