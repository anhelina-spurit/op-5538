/************************
RANDOM DATA GENERATORS
************************/

export function getRandomNumber(max = 10000) {
  return Math.ceil(Math.random() * max)
}

export function getRandomDate(start, end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().substring(0,10);
}

/************************
PARSING
************************/

export function getDate(string) {
  return new Date(string);
}

export function formatDateToFranceLocal(date) {
  return date.toLocaleDateString('fr-FR') || '';
}

export function getJSON(formData) {
  const object = {};
  formData.forEach((value, key) => object[key] = value);
  return JSON.stringify(object);
}

export function stringToHTML(str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};

/************************
DEBUG
************************/

export function clDebug(testMode, message) {
  return testMode && console.log(message);;
}

/************************
ANIMATIONS
************************/

export function fadeIn(el, time) {
  el.style.opacity = 0;
  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / time;
    last = +new Date();

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };

  tick();
}

/************************
URL
************************/

export function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/************************
ERROR
************************/

export function showSuccessFeedback(feedbackContainer, callback) {
  feedbackContainer.querySelector('.success').classList.remove('hidden');
  feedbackContainer.querySelector('.error').classList.add('hidden');

  if (typeof callback === 'function') callback(feedbackContainer);
}

export function showErrorFeedback(feedbackContainer, callback) {
  feedbackContainer.querySelector('.error').classList.remove('hidden');
  feedbackContainer.querySelector('.success').classList.add('hidden');

  if (typeof callback === 'function') callback(feedbackContainer);
}
