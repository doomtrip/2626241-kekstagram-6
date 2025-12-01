'use strict';

window.thumbnail = (function () {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const filtersContainer = document.querySelector('.img-filters');

  let photos = [];

  const renderThumbnails = (data = photos) => {
    const fragment = document.createDocumentFragment();

    // Удаляем существующие миниатюры
    const existingThumbnails = picturesContainer.querySelectorAll('.picture');
    existingThumbnails.forEach((thumbnail) => thumbnail.remove());

    // Создаем новые миниатюры
    data.forEach((photo, index) => {
      const thumbnail = pictureTemplate.cloneNode(true);
      const image = thumbnail.querySelector('.picture__img');
      const likes = thumbnail.querySelector('.picture__likes');
      const comments = thumbnail.querySelector('.picture__comments');

      image.src = photo.url;
      image.alt = photo.description;
      likes.textContent = photo.likes;
      comments.textContent = photo.comments.length;

      // Сохраняем данные фото в dataset для тестов
      thumbnail.dataset.index = index;
      thumbnail.dataset.id = photo.id;

      thumbnail.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (window.fullPhoto && window.fullPhoto.openFullPhoto) {
          window.fullPhoto.openFullPhoto(photo);
        }
      });

      fragment.appendChild(thumbnail);
    });

    picturesContainer.appendChild(fragment);
  };

  const loadAndRenderThumbnails = () => {
    console.log('loadAndRenderThumbnails called');
    
    if (window.api && window.api.getData) {
      return window.api.getData()
        .then((data) => {
          console.log('Data loaded:', data.length, 'items');
          photos = data;
          renderThumbnails(photos);
          
          // Показываем фильтры ТОЛЬКО после успешной загрузки данных
          if (filtersContainer) {
            filtersContainer.classList.remove('img-filters--inactive');
            
            // Убедимся, что кнопка "по умолчанию" активна при загрузке
            const defaultButton = filtersContainer.querySelector('#filter-default');
            if (defaultButton) {
              defaultButton.classList.add('img-filters__button--active');
            }
          }
          
          // Инициализируем фильтры с загруженными данными
          if (window.filters && window.filters.initFilters) {
            window.filters.initFilters(photos);
          }
          
          return data;
        })
        .catch((error) => {
          console.error('Failed to load photos:', error);
          // Фильтры остаются скрытыми при ошибке
          if (filtersContainer) {
            filtersContainer.classList.add('img-filters--inactive');
          }
          throw error;
        });
    } else {
      console.error('API module not loaded');
      return Promise.reject(new Error('API module not loaded'));
    }
  };

  return {
    loadAndRenderThumbnails,
    photos,
    renderThumbnails
  };
})();