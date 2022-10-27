/**
 * Get event prevented callback
 * @method preventDefault
 * @param {function} [callback]
 * @return function(event: Event)
 */
export const preventDefault = (callback) => (event) => {
  event.preventDefault();
  if (typeof callback === 'function') callback(event);
};
