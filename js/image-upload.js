'use strict';

window.imageUpload = (function () {
  const FILE_TYPES = ['jpg', 'jpeg', 'png'];

  const uploadInput = document.querySelector('#upload-file');
  const uploadPreview = document.querySelector('.img-upload__preview img');
  const effectsPreviews = document.querySelectorAll('.effects__preview');

  const loadUserImage = () => {
    const file = uploadInput.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (!matches) {
      alert('Можно загружать только изображения в форматах jpg, jpeg, png');
      return;
    }

    // Создаем blob URL вместо data URL
    const blobUrl = URL.createObjectURL(file);

    // Устанавливаем превью
    uploadPreview.src = blobUrl;

    // Обновляем превью эффектов
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${blobUrl})`;
    });

    // Также нужно сохранить blob для очистки позже
    if (window.imageUpload.currentBlobUrl) {
      URL.revokeObjectURL(window.imageUpload.currentBlobUrl);
    }
    window.imageUpload.currentBlobUrl = blobUrl;
  };

  const onFileInputChange = () => {
    if (uploadInput.files.length > 0) {
      loadUserImage();
    }
  };

  const initImageUpload = () => {
    uploadInput.addEventListener('change', onFileInputChange);
  };

  // Функция для очистки blob URL
  const cleanupBlobUrl = () => {
    if (window.imageUpload.currentBlobUrl) {
      URL.revokeObjectURL(window.imageUpload.currentBlobUrl);
      window.imageUpload.currentBlobUrl = null;
    }
  };

  return { 
    initImageUpload,
    loadUserImage,
    cleanupBlobUrl
  };
})();