// Функция проверки времени встречи
function isMeetingWithinWorkHours(workStart, workEnd, meetingStart, meetingDuration) {
  // Функция для преобразования времени в минуты
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Преобразуем все времена в минуты
  const workStartMinutes = timeToMinutes(workStart);
  const workEndMinutes = timeToMinutes(workEnd);
  const meetingStartMinutes = timeToMinutes(meetingStart);
  
  // Вычисляем время окончания встречи
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;
  
  // Проверяем, что встреча полностью вписывается в рабочий день
  return meetingStartMinutes >= workStartMinutes && 
         meetingEndMinutes <= workEndMinutes;
}

// Примеры использования (можно удалить после проверки)
console.log(isMeetingWithinWorkHours('08:00', '17:30', '14:00', 90)); // true
console.log(isMeetingWithinWorkHours('8:0', '10:0', '8:0', 120));     // true
console.log(isMeetingWithinWorkHours('08:00', '14:30', '14:00', 90)); // false
console.log(isMeetingWithinWorkHours('14:00', '17:30', '08:0', 90));  // false
console.log(isMeetingWithinWorkHours('8:00', '17:30', '08:00', 900)); // false