'use strict';

window.fullPhoto = (function () {
  const body = document.querySelector('body');
  const bigPicture = document.querySelector('.big-picture');
  const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const socialComments = bigPicture.querySelector('.social__comments');
  const socialCaption = bigPicture.querySelector('.social__caption');
  const commentCountBlock = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  const closeButton = bigPicture.querySelector('.big-picture__cancel');

  const COMMENTS_PER_PORTION = 5;
  let currentComments = [];
  let commentsShown = 0;

  const createComment = (comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    commentElement.innerHTML = `
      <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
      <p class="social__text">${comment.message}</p>
    `;

    return commentElement;
  };

  const renderComments = () => {
    const commentsPortion = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);
    const fragment = document.createDocumentFragment();

    commentsPortion.forEach((comment) => {
      const commentElement = createComment(comment);
      fragment.appendChild(commentElement);
    });

    socialComments.appendChild(fragment);

    commentsShown += commentsPortion.length;
    
    // ВАЖНО: создаем структуру которая ожидается тестами
    // Тесты ищут .social__comment-shown-count и .social__comment-total-count внутри .social__comment-count
    commentCountBlock.innerHTML = `
      <span class="social__comment-shown-count">${commentsShown}</span> из 
      <span class="social__comment-total-count">${currentComments.length}</span> комментариев
    `;

    // Обновляем отдельный элемент .comments-count если он существует
    if (commentsCount) {
      commentsCount.textContent = currentComments.length;
    }

    if (commentsShown >= currentComments.length) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
    }
  };

  const onCommentsLoaderClick = () => {
    renderComments();
  };

  const closeFullPhoto = () => {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    commentsLoader.removeEventListener('click', onCommentsLoaderClick);

    currentComments = [];
    commentsShown = 0;
  };

  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeFullPhoto();
    }
  }

  const openFullPhoto = (photoData) => {
    bigPictureImg.src = photoData.url;
    bigPictureImg.alt = photoData.description;
    
    // Обновляем счетчики лайков
    if (likesCount) {
      likesCount.textContent = photoData.likes;
    }
    
    // Обновляем общее количество комментариев в элементе .comments-count (если есть)
    if (commentsCount) {
      commentsCount.textContent = photoData.comments.length;
    }
    
    socialCaption.textContent = photoData.description;

    currentComments = photoData.comments;
    commentsShown = 0;
    socialComments.innerHTML = '';

    // Убеждаемся что счетчик комментариев видим
    commentCountBlock.classList.remove('hidden');
    
    // Убеждаемся что кнопка загрузки видима (потом скроется если нужно)
    commentsLoader.classList.remove('hidden');

    renderComments();

    bigPicture.classList.remove('hidden');
    body.classList.add('modal-open');

    document.addEventListener('keydown', onDocumentKeydown);
    closeButton.addEventListener('click', closeFullPhoto);
    commentsLoader.addEventListener('click', onCommentsLoaderClick);
  };

  return { openFullPhoto };
})();