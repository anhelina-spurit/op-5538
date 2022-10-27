export function onDOMReady(callback, waitForEmptyStack = true) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (waitForEmptyStack) {
      setTimeout(callback, 0);
    } else {
      callback();
    }

    return;
  }

  document.addEventListener('DOMContentLoaded', callback);
}
