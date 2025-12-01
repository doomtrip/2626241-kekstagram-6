'use strict';

window.imageEditor = (function () {
  const SCALE_STEP = 25;
  const SCALE_MIN = 25;
  const SCALE_MAX = 100;
  const SCALE_DEFAULT = 100;

  const uploadForm = document.querySelector('.img-upload__form');
  const scaleControlValue = uploadForm.querySelector('.scale__control--value');
  const scaleControlSmaller = uploadForm.querySelector('.scale__control--smaller');
  const scaleControlBigger = uploadForm.querySelector('.scale__control--bigger');
  const imagePreview = uploadForm.querySelector('.img-upload__preview img');
  const effectsList = uploadForm.querySelector('.effects__list');
  const effectLevel = uploadForm.querySelector('.img-upload__effect-level');
  const effectLevelValue = uploadForm.querySelector('.effect-level__value');
  const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');

  let currentScale = SCALE_DEFAULT;
  let currentEffect = 'none';
  let slider = null;

  const effects = {
    none: {
      filter: 'none',
      min: 0,
      max: 100,
      step: 1,
      unit: '',
    },
    chrome: {
      filter: 'grayscale',
      min: 0,
      max: 1,
      step: 0.1,
      unit: '',
    },
    sepia: {
      filter: 'sepia',
      min: 0,
      max: 1,
      step: 0.1,
      unit: '',
    },
    marvin: {
      filter: 'invert',
      min: 0,
      max: 100,
      step: 1,
      unit: '%',
    },
    phobos: {
      filter: 'blur',
      min: 0,
      max: 3,
      step: 0.1,
      unit: 'px',
    },
    heat: {
      filter: 'brightness',
      min: 1,
      max: 3,
      step: 0.1,
      unit: '',
    },
  };

  // Функция для форматирования числа (убирает лишние нули)
  const formatNumber = (value) => {
    const num = parseFloat(value);
    // Если целое число, возвращаем без точки
    if (num % 1 === 0) {
      return num.toString();
    }
    // Убираем лишние нули в конце
    return parseFloat(num.toFixed(10)).toString();
  };

  // --- Функции для масштаба (Scale) ---

  const updateScale = (newScale) => {
    currentScale = newScale;
    scaleControlValue.value = `${currentScale}%`;
    imagePreview.style.transform = `scale(${currentScale / 100})`;
  };

  const onScaleControlSmallerClick = () => {
    const newScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
    updateScale(newScale);
  };

  const onScaleControlBiggerClick = () => {
    const newScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
    updateScale(newScale);
  };

  // --- Функции для эффектов (Effects) и слайдера (Slider) ---

  const onSliderUpdate = () => {
    if (!slider) {
      return;
    }

    const value = slider.get();
    const formattedValue = formatNumber(value);
    effectLevelValue.value = formattedValue;

    const { filter, unit } = effects[currentEffect];
    imagePreview.style.filter = `${filter}(${value}${unit})`;
  };

  const hideSlider = () => {
    effectLevel.classList.add('hidden');
  };

  const showSlider = () => {
    effectLevel.classList.remove('hidden');
  };

  const updateSlider = (effect) => {
    currentEffect = effect;
    
    // Убираем все классы эффектов
    imagePreview.className = '';
    
    // Добавляем класс для выбранного эффекта
    if (effect !== 'none') {
      imagePreview.classList.add(`effects__preview--${effect}`);
    }

    const effectConfig = effects[effect];

    // Уничтожаем существующий слайдер
    if (slider) {
      slider.destroy();
      slider = null;
    }

    // Обработка эффекта "Оригинал" (none)
    if (effect === 'none') {
      hideSlider();
      imagePreview.style.filter = 'none';
      effectLevelValue.value = '';
      return;
    }

    // Проверяем, доступна ли библиотека noUiSlider
    if (typeof noUiSlider === 'undefined') {
      console.error('noUiSlider library is not loaded');
      showSlider();
      const formattedMax = formatNumber(effectConfig.max);
      imagePreview.style.filter = `${effectConfig.filter}(${effectConfig.max}${effectConfig.unit})`;
      effectLevelValue.value = formattedMax;
      return;
    }

    // Создаем слайдер для выбранного эффекта
    showSlider();
    
    // Создаем новый слайдер с параметрами эффекта
    slider = noUiSlider.create(effectLevelSlider, {
      range: {
        min: effectConfig.min,
        max: effectConfig.max
      },
      start: effectConfig.max,
      step: effectConfig.step,
      connect: 'lower',
      orientation: 'horizontal',
      format: {
        to: function(value) {
          // Форматируем значение для отображения (убираем лишние нули)
          return formatNumber(value);
        },
        from: function(value) {
          return parseFloat(value);
        }
      }
    });

    slider.on('update', onSliderUpdate);
    
    // Применяем начальное значение
    const formattedMax = formatNumber(effectConfig.max);
    imagePreview.style.filter = `${effectConfig.filter}(${effectConfig.max}${effectConfig.unit})`;
    effectLevelValue.value = formattedMax;
  };

  const onEffectsListChange = (evt) => {
    if (evt.target.type === 'radio' && evt.target.name === 'effect') {
      const effect = evt.target.value;
      updateSlider(effect);
    }
  };

  const resetImageEditor = () => {
    currentScale = SCALE_DEFAULT;
    updateScale(SCALE_DEFAULT);

    currentEffect = 'none';
    imagePreview.style.filter = 'none';
    imagePreview.className = '';
    
    // Сбрасываем радио-кнопку на "Оригинал"
    const noneEffect = effectsList.querySelector('#effect-none');
    if (noneEffect) {
      noneEffect.checked = true;
    }

    hideSlider();
    effectLevelValue.value = '';
    
    // Уничтожаем слайдер
    if (slider) {
      slider.destroy();
      slider = null;
    }
  };

  const initImageEditor = () => {
    updateScale(SCALE_DEFAULT);

    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    effectsList.addEventListener('change', onEffectsListChange);

    // Изначально скрываем слайдер
    hideSlider();
    
    // Убедимся, что при инициализации выбрано "Оригинал"
    const noneEffect = effectsList.querySelector('#effect-none');
    if (noneEffect) {
      noneEffect.checked = true;
    }
  };

  return {
    initImageEditor,
    resetImageEditor,
    updateScale
  };
})();