'use strict';

window.filters = (function () {
  const filtersContainer = document.querySelector('.img-filters');
  const filtersForm = document.querySelector('.img-filters__form');
  const filterButtons = {
    default: document.querySelector('#filter-default'),
    random: document.querySelector('#filter-random'),
    discussed: document.querySelector('#filter-discussed')
  };

  let currentFilter = 'default';
  let photos = [];
  let applyFilterTimeout = null;

  // Функции фильтрации
  const getDefaultPhotos = () => [...photos];
  
  const getRandomPhotos = () => {
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };
  
  const getDiscussedPhotos = () => {
    return [...photos].sort((a, b) => b.comments.length - a.comments.length);
  };

  // Смена активной кнопки - СИНХРОННО и НЕМЕДЛЕННО
  const setActiveButton = (filterName) => {
    // Убираем активный класс со всех
    Object.values(filterButtons).forEach(button => {
      if (button) {
        button.classList.remove('img-filters__button--active');
      }
    });
    
    // Добавляем активный класс выбранной - СРАЗУ!
    if (filterButtons[filterName]) {
      filterButtons[filterName].classList.add('img-filters__button--active');
    }
    
    currentFilter = filterName;
  };

  // Применение фильтра с debounce (для отрисовки)
  const applyFilter = () => {
    if (!photos.length || !window.thumbnail || !window.thumbnail.renderThumbnails) {
      return;
    }

    let filteredPhotos;
    switch (currentFilter) {
      case 'random':
        filteredPhotos = getRandomPhotos();
        break;
      case 'discussed':
        filteredPhotos = getDiscussedPhotos();
        break;
      default:
        filteredPhotos = getDefaultPhotos();
    }

    // Очищаем предыдущий таймаут
    if (applyFilterTimeout) {
      clearTimeout(applyFilterTimeout);
    }

    // Используем нативный setTimeout для работы с подмененными таймерами Cypress
    applyFilterTimeout = setTimeout(() => {
      window.thumbnail.renderThumbnails(filteredPhotos);
    }, 500);
  };

  // Обработчики кликов - ВАЖНО: класс добавляется СРАЗУ
  const onDefaultClick = (evt) => {
    evt.preventDefault();
    setActiveButton('default');
    applyFilter();
  };

  const onRandomClick = (evt) => {
    evt.preventDefault();
    setActiveButton('random'); // Класс добавится СЕЙЧАС ЖЕ
    applyFilter();
  };

  const onDiscussedClick = (evt) => {
    evt.preventDefault();
    setActiveButton('discussed');
    applyFilter();
  };

  // Инициализация
  const initFilters = (loadedPhotos) => {
    if (loadedPhotos && loadedPhotos.length) {
      photos = loadedPhotos;
    }

    // Показываем фильтры
    filtersContainer.classList.remove('img-filters--inactive');
    
    // Вешаем обработчики
    if (filterButtons.default) {
      filterButtons.default.addEventListener('click', onDefaultClick);
      // Убедимся, что кнопка "по умолчанию" активна при инициализации
      filterButtons.default.classList.add('img-filters__button--active');
    }
    
    if (filterButtons.random) {
      filterButtons.random.addEventListener('click', onRandomClick);
    }
    
    if (filterButtons.discussed) {
      filterButtons.discussed.addEventListener('click', onDiscussedClick);
    }
    
    console.log('Filters initialized');
  };

  // Публичные методы
  return {
    initFilters,
    setActiveButton
  };
})();