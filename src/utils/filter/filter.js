import dayjs from 'dayjs';

/**
 * Formatting iso date
 */
const formatISODate = (date) => {
  const [datetime, timezone] = date.split('+');
  if (!timezone || timezone.indexOf(':') >= 0) return date;
  const hourOfTz = timezone.substring(0, 2) || '00';
  const secondOfTz = timezone.substring(2, 4) || '00';
  return `${datetime}+${hourOfTz}:${secondOfTz}`;
};
/**
 * Formatting time
 */
const formatDate = (value, fmt) => {
  const fmtN = fmt || 'YYYY-MM-DD HH:mm:ss';
  if (value === null) {
    return '-';
  }
  return dayjs(formatISODate(value)).format(fmtN);
};
/**
 * filter null
 */
const filterNull = (value) => {
  if (value === null || value === '') {
    return '-';
  }
  return value;
};

export {
  formatDate, filterNull,
};
