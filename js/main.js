import { generatePhotos } from './data.js';
import { initFilters } from './filters.js';
import { initUploadForm } from './upload.js';
import { isMeetingWithinWorkHours } from './functions.js'; // ДОБАВИТЬ ЭТУ СТРОКУ

const initApp = () => {
  generatePhotos();
  initFilters();
  initUploadForm();

  isMeetingWithinWorkHours('08:00', '17:30', '14:00', 90);
};

document.addEventListener('DOMContentLoaded', initApp);
