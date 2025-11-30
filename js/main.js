import { generatePhotos } from './data.js';
import { initFilters } from './filters.js';
import { initUploadForm } from './upload.js';

const initApp = () => {
  const photos = generatePhotos();
  
  const filters = initFilters();
  initUploadForm();
};

document.addEventListener('DOMContentLoaded', initApp);