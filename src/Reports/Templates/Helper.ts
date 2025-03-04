/* eslint-disable prettier/prettier */
import Handlebars from 'handlebars';

Handlebars.registerHelper('formatDate', function (date: Date, format: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  if (format === 'date') {
    return date.toLocaleDateString('es-ES', options);
  } else if (format === 'datetime') {
    return date.toLocaleString('es-ES', options);
  }
  return date;
});
