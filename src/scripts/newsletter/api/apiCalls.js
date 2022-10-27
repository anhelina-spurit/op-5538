export function fetchAPI(requestURL, callback, body) {
  return fetch(requestURL, {
    method: 'POST',
    ...(body && { body }),
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('An error occurred - fetchAPI');
    })
    .then(function (data) {
      callback(data);
    })
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.warn(`(fetchAPI - ${requestURL}) :: Something  went wrong.`, err);
    });
}
