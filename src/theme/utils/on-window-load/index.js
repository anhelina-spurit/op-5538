export function onWindowLoad(callback) {
  if (document.readyState === 'complete') {
    return setTimeout(callback, 0);
  }

  return window.addEventListener('load', callback);
}
