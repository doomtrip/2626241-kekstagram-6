'use strict';

window.util = (function () {
  const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

  const createIdGenerator = () => {
    let lastGeneratedId = 0;
    return () => ++lastGeneratedId;
  };

  const isEscapeKey = (evt) => evt.key === 'Escape';

  return {
    getRandomInteger,
    getRandomArrayElement,
    createIdGenerator,
    isEscapeKey
  };
})();