window.thumbnail = (function () {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const filtersContainer = document.querySelector('.img-filters');

  let photos = [];

  const renderThumbnails = (data = photos) => {
    const fragment = document.createDocumentFragment();

    const existingThumbnails = picturesContainer.querySelectorAll('.picture');
    existingThumbnails.forEach((thumbnail) => thumbnail.remove());

    data.forEach((photo, index) => {
      const thumbnail = pictureTemplate.cloneNode(true);
      const image = thumbnail.querySelector('.picture__img');
      const likes = thumbnail.querySelector('.picture__likes');
      const comments = thumbnail.querySelector('.picture__comments');

      image.src = photo.url;
      image.alt = photo.description;
      likes.textContent = photo.likes;
      comments.textContent = photo.comments.length;

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
    if (window.api && window.api.getData) {
      return window.api.getData()
        .then((data) => {
          photos = data;
          renderThumbnails(photos);

          if (filtersContainer) {
            filtersContainer.classList.remove('img-filters--inactive');

            const defaultButton = filtersContainer.querySelector('#filter-default');
            if (defaultButton) {
              defaultButton.classList.add('img-filters__button--active');
            }
          }

          if (window.filters && window.filters.initFilters) {
            window.filters.initFilters(photos);
          }

          return data;
        })
        .catch(() => {
          if (filtersContainer) {
            filtersContainer.classList.add('img-filters--inactive');
          }
          throw new Error('Failed to load photos');
        });
    } else {
      return Promise.reject(new Error('API module not loaded'));
    }
  };

  return {
    loadAndRenderThumbnails,
    photos,
    renderThumbnails
  };
})();
