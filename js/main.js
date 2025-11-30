import { generatePhotos } from './data.js';
import { initFilters } from './filters.js';
import { initUploadForm } from './upload.js';

// Инициализация приложения
const initApp = () => {
  // Генерация данных
  const photos = generatePhotos();
  console.log('Сгенерированные фотографии:', photos);
  
  // Инициализация фильтров
  const filters = initFilters();
  
  // Инициализация формы загрузки
  initUploadForm();
  
  // Другие инициализации...
};

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);