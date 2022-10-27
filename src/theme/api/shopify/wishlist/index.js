export const wishlistAPI = {
  get(handle) {
    return fetch(`${handle}`).then((response) => response.json());
  },
};
