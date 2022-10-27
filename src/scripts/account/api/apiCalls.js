export function fetchAPI(requestURL, callback, method = 'GET', body, retries = 0) {
  return fetch(requestURL, {
    method,
    ...(body && { body }),
  })
    .then(function (response) {
      document.dispatchEvent(
        new CustomEvent('customer:request', {
          detail: {
            status: response.status,
            url: response.url,
          },
        }),
      );
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') > -1) return response.json();
        return response.text();
      }
      throw new Error('An error occurred - fetchAPI');
    })
    .then(function (data) {
      callback(data);
    })
    .catch(function (err) {
      if (retries > 0) {
        setTimeout(() => {
          return fetchAPI(requestURL, callback, method, body, retries - 1);
        }, 2000);
      }
      // eslint-disable-next-line no-console
      console.warn(`(fetchAPI - ${requestURL}) :: Something  went wrong.`, err);
    });
}
