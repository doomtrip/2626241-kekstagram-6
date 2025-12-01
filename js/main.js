(function() {
  const createDataError = () => {
    const errorElement = document.createElement('div');
    errorElement.className = 'data-error';
    errorElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 15px;
      background-color: #ff4e4e;
      color: white;
      text-align: center;
      font-family: "Open Sans", "Arial", sans-serif;
      font-weight: 700;
    `;
    errorElement.textContent = 'Не удалось загрузить данные. Попробуйте обновить страницу';
    return errorElement;
  };

  const showDataError = () => {
    let errorElement = document.querySelector('.data-error');
    if (!errorElement) {
      errorElement = createDataError();
      document.body.appendChild(errorElement);

      setTimeout(() => {
        if (errorElement && errorElement.parentNode) {
          errorElement.remove();
        }
      }, 5000);
    }
  };

  const initApp = () => {
    if (window.imageEditor && window.imageEditor.initImageEditor) {
      window.imageEditor.initImageEditor();
    }

    if (window.imageUpload && window.imageUpload.initImageUpload) {
      window.imageUpload.initImageUpload();
    }

    if (window.thumbnail && window.thumbnail.loadAndRenderThumbnails) {
      window.thumbnail.loadAndRenderThumbnails()
        .catch(() => {
          showDataError();
        });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
